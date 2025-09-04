import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CategoryRepository {
  constructor(
    private readonly categoryRepository: DatabaseService,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: any, userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new Error('User not found');
      }
      const category = await this.categoryRepository.category.create({
        data: {
          name: dto.name,
          userId: user.id,
        },
      });
      if (!category) {
        throw new Error('Category not created');
      }
      return category;
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
      const categories = await this.categoryRepository.category.findMany({
        where: {
          userId: user.id,
        },
      });
      return categories;
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
      const category = await this.categoryRepository.category.findUnique({
        where: {
          id,
        },
      });
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
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
      await this.categoryRepository.category.delete({
        where: {
          id,
        },
      });
      return {
        message: 'Category deleted successfully',
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: string, updateCategoryDto: any, userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new Error('User not found');
      }
      await this.categoryRepository.category.update({
        where: {
          id,
        },
        data: {
          name: updateCategoryDto.name,
        },
      });
      return {
        message: 'Category updated successfully',
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
