import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UsersService } from 'src/users/users.service';
import { TransactionType } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly transactionRepository: DatabaseService,
    private readonly categoryRepository: DatabaseService,
  ) {}

  async getSummary(userId: string, startDate?: Date, endDate?: Date) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new Error('User not found');
      }
      const dateFilter = {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      };
      const totalIncome =
        await this.transactionRepository.transaction.aggregate({
          _sum: { amount: true },
          where: { ...dateFilter, type: TransactionType.INCOME },
        });

      const totalExpense =
        await this.transactionRepository.transaction.aggregate({
          _sum: { amount: true },
          where: { ...dateFilter, type: TransactionType.EXPENSE },
        });

      const income = totalIncome._sum.amount || 0;
      const expense = totalExpense._sum.amount || 0;
      const balance = income - expense;

      const report = {
        income,
        expense,
        balance,
      };
      return report;
    } catch (error) {
      throw new Error('Error getting report' + error);
    }
  }

  async getSpendingByCategory(
    userId: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const spending = await this.transactionRepository.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        type: TransactionType.EXPENSE,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: 'desc',
        },
      },
    });

    // Para tornar o relatório mais útil, buscamos os nomes das categorias
    const categoryIds = spending
      .map((s) => s.categoryId)
      .filter((id) => id !== null);

    const categories = await this.categoryRepository.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true },
    });

    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

    return spending.map((item) => ({
      categoryId: item.categoryId,
      categoryName: categoryMap.get(item.categoryId) || 'Sem Categoria',
      total: item._sum.amount || 0,
    }));
  }
}
