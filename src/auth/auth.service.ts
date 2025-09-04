import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/create-auth.dto';
import {
  comparePassword,
  generateToken,
} from 'src/middleware/generate-token.middleware';
@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService) private readonly userService: UsersService,
  ) {}

  async create(dto: RegisterAuthDto) {
    try {
      const { name, email, password } = dto;
      if (!name || !email || !password) {
        throw new BadRequestException('All fields are required');
      }
      const user = await this.userService.create(dto);
      const token = await generateToken({ userId: user.id, email: user.email });
      return { user, token };
    } catch (error) {
      throw new InternalServerErrorException('Error creating user', error);
    }
  }

  async login(dto: LoginAuthDto) {
    try {
      const { email, password } = dto;
      if (!email || !password) {
        throw new BadRequestException('All fields are required');
      }
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const isValidPassword = await comparePassword(password, user.password);
      if (!isValidPassword) {
        throw new ConflictException('Invalid password');
      }
       const payload = { userId: user.id, email: user.email };
      const token = await generateToken(payload);
      return { token };
    } catch (error) {
      throw new InternalServerErrorException('Login failed', error);
    }
  }

  async getUserProfile(userId: string) {
    try {
      const user = await this.userService.getUserProfile(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error getting user profile', error);
    }
  }
}
