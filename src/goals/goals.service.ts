import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { GoalRepository } from './repository/goal.repository';
import { UsersService } from 'src/users/users.service';
import { ContributeToGoalDto } from './dto/contribute-to-goal.dto';

@Injectable()
export class GoalsService {
  constructor(
    private readonly goalRepository: GoalRepository,
    private readonly usersService: UsersService,
  ) {}
  async create(createGoalDto: CreateGoalDto, userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const goal = await this.goalRepository.create(createGoalDto, user.id);
      const { name, targetAmount, deadline } = createGoalDto;
      if (!name || !targetAmount || !deadline) {
        throw new BadRequestException('All fields are required');
      }
      return goal;
    } catch (error) {
      throw new InternalServerErrorException('Error creating goal', error);
    }
  }

  async findAll(userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const goals = await this.goalRepository.findAll(userId);
      return goals;
    } catch (error) {
      throw new InternalServerErrorException('Error getting goals', error);
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const goal = await this.goalRepository.findOne(id, userId);
      return goal;
    } catch (error) {
      throw new InternalServerErrorException('Error getting goal', error);
    }
  }

  async update(id: string, updateGoalDto: UpdateGoalDto, userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const { name, targetAmount, deadline } = updateGoalDto;
      if (!name || !targetAmount || !deadline) {
        throw new BadRequestException('All fields are required');
      }
      await this.goalRepository.update(id, updateGoalDto, userId);
      return { message: 'Goal updated successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error updating goal', error);
    }
  }

  async contribute(id: string, dto: ContributeToGoalDto, userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return this.goalRepository.contribute(id, dto, userId);
    } catch (error) {
      throw new InternalServerErrorException('Error contributing to goal', error);
    }
  }

  async remove(id: string, userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      await this.goalRepository.remove(id, userId);
      return { message: 'Goal deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error deleting goal', error);
    }
  }
}
