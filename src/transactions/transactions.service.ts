import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionRepository } from './repository/transaction.repository';
import { UsersService } from 'src/users/users.service';
import { AccountsService } from 'src/accounts/accounts.service';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AccountsService)) private readonly accountService: AccountsService,
    private readonly categoryService: CategoryService,
  ) {}
  async create(dto: CreateTransactionDto, userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const { amount, description, date, type, accountId, categoryId } = dto;
      if (!amount || !description || !date || !type || !accountId) {
        throw new BadRequestException('Missing required fields');
      }
      if (amount <= 0) {
        throw new ConflictException('Amount must be greater than 0');
      }
      await this.validateAccountOwnerShip(accountId, userId);
      if (categoryId) {
        await this.validateCategoryOwnerShip(categoryId, userId);
      }
      const createdTransaction = await this.transactionRepository.create(
        dto,
        userId,
      );
      return createdTransaction;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating transaction',
        error,
      );
    }
  }

  async findAll(userId: string, accountId?: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new Error('User not found');
      }
      const transactions = await this.transactionRepository.findAll(
        userId,
        accountId,
      );
      return transactions;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error getting transactions',
        error,
      );
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new Error('User not found');
      }
      const transaction = await this.transactionRepository.findOne(id, userId);
      if (!transaction) {
        throw new Error(`Transaction with ID ${id} not found`);
      }
      if (transaction.userId !== userId) {
        throw new Error(
          'You do not have permission to access this transaction',
        );
      }
      return transaction;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error getting transaction',
        error,
      );
    }
  }

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
    userId: string,
  ) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new Error('User not found');
      }
      const transaction = await this.transactionRepository.findOne(id, userId);
      if (!transaction) {
        throw new Error(`Transaction with ID ${id} not found`);
      }
      if (transaction.userId !== userId) {
        throw new Error(
          'You do not have permission to access this transaction',
        );
      }
      await this.transactionRepository.update(id, updateTransactionDto, userId);
      return { message: 'Transaction updated successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating transaction',
        error,
      );
    }
  }

  async remove(id: string, userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new Error('User not found');
      }
      const transaction = await this.transactionRepository.findOne(id, userId);
      if (!transaction) {
        throw new Error(`Transaction with ID ${id} not found`);
      }
      if (transaction.userId !== userId) {
        throw new Error(
          'You do not have permission to access this transaction',
        );
      }
      await this.transactionRepository.remove(id, userId);
      return { message: 'Transaction deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error deleting transaction',
        error,
      );
    }
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
