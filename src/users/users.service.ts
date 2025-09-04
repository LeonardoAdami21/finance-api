import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { name, email, password } = createUserDto;
      if (!name || !email || !password) {
        throw new BadRequestException('All fields are required');
      }
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw new BadRequestException('User already exists');
      }
      const user = await this.userRepository.create(createUserDto);
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error creating user', error);
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getUserProfile(userId: string) {
    try {
      const user = await this.userRepository.getUserProfile(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error getting user profile', error);
    }
  }
}
