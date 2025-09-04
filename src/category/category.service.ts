import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './repository/category.repository';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly usersService: UsersService,
  ) {}
  async create(createCategoryDto: CreateCategoryDto, userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const { name } = createCategoryDto;
      if (!name) {
        throw new BadRequestException('Name is required');
      }
      const category = await this.categoryRepository.create(
        createCategoryDto,
        user.id,
      );
      return category;
    } catch (error) {
      throw new InternalServerErrorException('Error creating category', error);
    }
  }

  async findAll(userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const categories = await this.categoryRepository.findAll(user.id);
      return categories;
    } catch (error) {
      throw new InternalServerErrorException('Error getting categories', error);
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const category = await this.categoryRepository.findOne(id, user.id);
      return category;
    } catch (error) {
      throw new InternalServerErrorException('Error getting category', error);
    }
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    userId: string,
  ) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const category = await this.categoryRepository.findOne(id, user.id);
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      const { name } = updateCategoryDto;
      if (!name) {
        throw new BadRequestException('Name is required');
      }
      await this.categoryRepository.update(id, updateCategoryDto, user.id);
      return { message: 'Category updated successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error updating category', error);
    }
  }

  async remove(id: string, userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const category = await this.categoryRepository.findOne(id, user.id);
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      await this.categoryRepository.remove(id, user.id);
      return { message: 'Category deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error deleting category', error);
    }
  }
}
