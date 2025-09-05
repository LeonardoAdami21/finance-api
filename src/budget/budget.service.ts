import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { BudgetRepository } from './repository/budget.repository';
import { UsersService } from 'src/users/users.service';
import { CategoryService } from 'src/category/category.service';
import { BADFAMILY } from 'dns';

@Injectable()
export class BudgetService {
  constructor(
    private readonly budgetRepository: BudgetRepository,
    private readonly usersService: UsersService,
    private readonly categoryService: CategoryService,
  ) {}

  async create(dto: CreateBudgetDto, userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const { name, amount, startDate, endDate, categoryId } = dto;
      if (!name || !amount || !startDate || !endDate || !categoryId) {
        throw new BadRequestException('Missing required fields');
      }
      const category = await this.categoryService.findOne(categoryId, userId);
      if (!category || category.userId !== userId) {
        throw new NotFoundException('Category not found');
      }
      const budget = await this.budgetRepository.create(dto, userId);
      if (!budget) {
        throw new ConflictException('Budget not created');
      }
      return budget;
    } catch (error) {
      throw new InternalServerErrorException('Error creating budget', error);
    }
  }

  async findAll(userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const budgets = await this.budgetRepository.findAll(userId);
      return budgets;
    } catch (error) {
      throw new InternalServerErrorException('Error getting budgets', error);
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const budget = await this.budgetRepository.findOne(id, userId);
      if (!budget) {
        throw new NotFoundException(`Budget with ID ${id} not found`);
      }
      if (budget.userId !== userId) {
        throw new NotFoundException(
          'You do not have permission to access this budget',
        );
      }
      return budget;
    } catch (error) {
      throw new InternalServerErrorException('Error getting budget', error);
    }
  }

  async update(id: string, updateBudgetDto: UpdateBudgetDto, userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const { name, amount, startDate, endDate, categoryId } = updateBudgetDto;
      if (!name || !amount || !startDate || !endDate || !categoryId) {
        throw new BadRequestException('Missing required fields');
      }
      const category = await this.categoryService.findOne(categoryId, userId);
      if (!category || category.userId !== userId) {
        throw new NotFoundException('Category not found');
      }
      const budget = await this.budgetRepository.update(
        id,
        updateBudgetDto,
        userId,
      );
      if (!budget) {
        throw new NotFoundException(`Budget with ID ${id} not found`);
      }
      return budget;
    } catch (error) {
      throw new InternalServerErrorException('Error updating budget', error);
    }
  }

  async remove(id: string, userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      await this.budgetRepository.remove(id, userId);
      return { message: 'Budget deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error deleting budget', error);
    }
  }
}
