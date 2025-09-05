import { Injectable } from '@nestjs/common';
import { CategoryService } from 'src/category/category.service';
import { DatabaseService } from 'src/database/database.service';
import { UsersService } from 'src/users/users.service';
import { CreateBudgetDto } from '../dto/create-budget.dto';

@Injectable()
export class BudgetRepository {
  constructor(
    private readonly budgetRepository: DatabaseService,
    private readonly usersService: UsersService,
    private readonly categoryService: CategoryService,
  ) {}

  async create(dto: CreateBudgetDto, userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      const { name, amount, startDate, endDate, categoryId } = dto;
      const category = await this.categoryService.findOne(categoryId, userId);
      if (!category || category.userId !== userId) {
        throw new Error('Category not found');
      }
      const budget = await this.budgetRepository.budget.create({
        data: {
          name,
          amount,
          startDate,
          endDate,
          userId: user.id,
          categoryId: category.id,
        },
      });
      if (!budget) {
        throw new Error('Budget not created');
      }
      return budget;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new Error('User not found');
      }
      const budgets = await this.budgetRepository.budget.findMany({
        where: {
          userId,
        },
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
      });
      return budgets;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new Error('User not found');
      }
      const budget = await this.budgetRepository.budget.findUnique({
        where: {
          id,
          userId,
        },
        include: {
          category: {
            select: {
              name: true,
            },
          },
        },
      });
      if (!budget) {
        throw new Error(`Budget with ID ${id} not found`);
      }
      if (budget.userId !== userId) {
        throw new Error('You do not have permission to access this budget');
      }
      return budget;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: string, dto: CreateBudgetDto, userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new Error('User not found');
      }
      const { amount, startDate, endDate, categoryId } = dto;
      const category = await this.categoryService.findOne(categoryId, userId);
      if (!category || category.userId !== userId) {
        throw new Error('Category not found');
      }
      const budget = await this.budgetRepository.budget.update({
        where: {
          id,
          userId,
        },
        data: {

          amount,
          startDate,
          endDate,
          categoryId: category.id,
        },
      });
      if (!budget) {
        throw new Error(`Budget with ID ${id} not found`);
      }
      return budget;
    } catch (error) {
      throw new Error(error);
    }
  }

  async remove(id: string, userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new Error('User not found');
      }
      const budget = await this.budgetRepository.budget.delete({
        where: {
          id,
          userId,
        },
      });
      if (!budget) {
        throw new Error(`Budget with ID ${id} not found`);
      }
      if (budget.userId !== userId) {
        throw new Error('You do not have permission to access this budget');
      }
      return { message: 'Budget deleted successfully' };
    } catch (error) {
      throw new Error(error);
    }
  }
}
