import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UsersService } from 'src/users/users.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { AccountsService } from 'src/accounts/accounts.service';
import { CategoryService } from 'src/category/category.service';
import { TransactionType } from '@prisma/client';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';

@Injectable()
export class TransactionRepository {
  constructor(
    private readonly transactionRepository: DatabaseService,
    private readonly usersService: UsersService,
    private readonly accountService: AccountsService,
    private readonly categoryService: CategoryService,
  ) {}

  async create(dto: CreateTransactionDto, userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new Error('User not found');
      }
      const { amount, description, date, type, accountId, categoryId } = dto;
      await this.validateAccountOwnerShip(accountId, userId);
      if (!amount || !description || !date || !type || !accountId) {
        throw new Error('Missing required fields');
      }
      if (amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }
      await this.validateCategoryOwnerShip(categoryId, userId);
      return this.transactionRepository.$transaction(async (tx) => {
        const createdTransaction = await tx.transaction.create({
          data: {
            ...dto,
            userId,
          },
        });

        const balanceModifier =
          type === TransactionType.INCOME ? amount : -amount;

        await tx.account.update({
          where: { id: accountId },
          data: {
            balance: {
              increment: balanceModifier,
            },
          },
        });

        return createdTransaction;
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(userId: string, accountId?: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new Error('User not found');
      }
      const transactions =
        await this.transactionRepository.transaction.findMany({
          where: {
            userId,
            accountId: accountId || undefined,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
      return transactions;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: string, userId: string) {
    const transaction = await this.transactionRepository.transaction.findUnique(
      {
        where: { id },
      },
    );

    if (!transaction) {
      throw new Error(`Transaction with ID ${id} not found`);
    }

    if (transaction.userId !== userId) {
      throw new Error('You do not have permission to access this transaction');
    }

    return transaction;
  }

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
    userId: string,
  ) {
    const originalTransaction = await this.findOne(id, userId);

    return this.transactionRepository.$transaction(async (tx) => {
      // 1. Reverte o efeito da transação original no saldo da conta
      const originalBalanceModifier =
        originalTransaction.type === TransactionType.INCOME
          ? -originalTransaction.amount
          : originalTransaction.amount;

      await tx.account.update({
        where: { id: originalTransaction.accountId },
        data: { balance: { increment: originalBalanceModifier } },
      });

      // 2. Atualiza a transação
      const updatedTransaction = await tx.transaction.update({
        where: { id },
        data: {
          ...updateTransactionDto,
        },
      });

      // 3. Aplica o novo efeito da transação atualizada
      const newBalanceModifier =
        updatedTransaction.type === TransactionType.INCOME
          ? updatedTransaction.amount
          : -updatedTransaction.amount;

      await tx.account.update({
        where: { id: updatedTransaction.accountId },
        data: { balance: { increment: newBalanceModifier } },
      });

      return updatedTransaction;
    });
  }

  async remove(id: string, userId: string) {
    const transactionToRemove = await this.findOne(id, userId);

    return this.transactionRepository.$transaction(async (tx) => {
      // Reverte o efeito da transação no saldo antes de deletá-la
      const balanceModifier =
        transactionToRemove.type === TransactionType.INCOME
          ? -transactionToRemove.amount
          : transactionToRemove.amount;

      await tx.account.update({
        where: { id: transactionToRemove.accountId },
        data: {
          balance: {
            increment: balanceModifier,
          },
        },
      });

      // Deleta a transação
      return tx.transaction.delete({
        where: { id },
      });
    });
  }

  private async validateAccountOwnerShip(accountId: string, userId: string) {
    try {
      const account = await this.accountService.findOne(accountId, userId);
      if (!account || account.userId !== userId) {
        throw new Error('Account not found');
      }
      return account;
    } catch (error) {
      throw new Error(error);
    }
  }

  private async validateCategoryOwnerShip(categoryId: string, userId: string) {
    try {
      const category = await this.categoryService.findOne(categoryId, userId);
      if (!category || category.userId !== userId) {
        throw new Error('Category not found');
      }
      return category;
    } catch (error) {
      throw new Error(error);
    }
  }
}
