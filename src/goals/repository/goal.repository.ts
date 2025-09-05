import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateGoalDto } from '../dto/create-goal.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateGoalDto } from '../dto/update-goal.dto';
import { TransactionType } from '@prisma/client';
import { ContributeToGoalDto } from '../dto/contribute-to-goal.dto';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class GoalRepository {
  constructor(
    private readonly goalRepository: DatabaseService,
    private readonly usersService: UsersService,
    private readonly accountService: AccountsService,
  ) {}

  async findAll(userId: string) {
    const goals = await this.goalRepository.goal.findMany({
      where: {
        userId: userId,
      },
    });

    return goals;
  }

  async create(dto: CreateGoalDto, userId: string) {
    const user = await this.usersService.getUserProfile(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const { name, targetAmount, deadline } = dto;
    if (!name || !targetAmount || !deadline) {
      throw new Error('All fields are required');
    }
    const goal = await this.goalRepository.goal.create({
      data: {
        name,
        targetAmount,
        deadline,
        userId,
      },
    });
    return goal;
  }

  async findOne(id: string, userId: string) {
    const goal = await this.goalRepository.goal.findUnique({
      where: {
        id: id,
      },
    });
    if (!goal) {
      throw new Error('Goal not found');
    }
    if (goal.userId !== userId) {
      throw new Error('You do not have permission to access this goal');
    }
    return goal;
  }

  async update(id: string, dto: UpdateGoalDto, userId: string) {
    const goal = await this.findOne(id, userId);
    if (!goal) {
      throw new Error('Goal not found');
    }
    const { name, targetAmount, deadline } = dto;
    if (!name || !targetAmount || !deadline) {
      throw new Error('All fields are required');
    }
    await this.goalRepository.goal.update({
      where: {
        id: id,
      },
      data: {
        name,
        targetAmount,
        deadline,
      },
    });
    return { message: 'Goal updated successfully' };
  }

  async contribute(id: string, dto: ContributeToGoalDto, userId: string) {
    const { amount, fromAccountId } = dto;
    const goal = await this.findOne(id, userId);

    const account = await this.accountService.findOne(fromAccountId, userId);

    if (!account) {
      throw new Error(
        `Account with ID ${fromAccountId} not found or does not belong to the user`,
      );
    }

    return this.goalRepository.$transaction(async (tx) => {
      // 1. Atualiza o saldo da conta
      const updatedAccount = await tx.account.update({
        where: { id: fromAccountId },
        data: { balance: { decrement: amount } },
      });

      // 2. Atualiza o valor atual da meta
      const updatedGoal = await tx.goal.update({
        where: { id },
        data: { currentAmount: { increment: amount } },
      });

      // 3. Cria a transação para manter o histórico
      await tx.transaction.create({
        data: {
          description: `Contribuição para a meta: ${goal.name}`,
          amount,
          date: new Date(),
          type: TransactionType.EXPENSE,
          userId,
          accountId: fromAccountId,
        },
      });

      return updatedGoal;
    });
  }

  async remove(id: string, userId: string) {
    const goal = await this.findOne(id, userId);
    if (!goal) {
      throw new Error('Goal not found');
    }
    await this.goalRepository.goal.delete({
      where: {
        id: id,
      },
    });
    return { message: 'Goal deleted successfully' };
  }
}
