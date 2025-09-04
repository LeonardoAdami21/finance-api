import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { DatabaseService } from 'src/database/database.service';
import { PrismaClient } from '@prisma/client';
import * as bcypt from 'bcrypt';
@Injectable()
export class UserRepository {
  constructor(private readonly userRepository: DatabaseService) {}
  async create(dto: CreateUserDto) {
    try {
      const { name, email, password } = dto;
      if (!name || !email || !password) {
        throw new Error('All fields are required');
      }
      const passwordHash = await bcypt.hash(password, 10);
      const user = await this.userRepository.user.create({
        data: {
          email,
          name,
          password: passwordHash,
        },
      });
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUserProfile(userId: string) {
    try {
      const user = await this.userRepository.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userRepository.user.findUnique({
        where: {
          email,
        },
      });
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }
}
