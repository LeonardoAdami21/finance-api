import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccountRepository } from './repository/account.repository';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AccountsService {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateAccountDto, req: any) {
    try {
      const { name, balance, accountType } = dto;
      if (!name || !balance || !accountType) {
        throw new BadRequestException('All fields are required');
      }
      if (balance < 0) {
        throw new BadRequestException('Balance cannot be negative');
      }
      const user = await this.usersService.getUserProfile(req);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const account = await this.accountRepository.create(dto, user.id);
      return account;
    } catch (error) {
      throw new InternalServerErrorException('Error creating account', error);
    }
  }

  async findAll(userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const accounts = await this.accountRepository.findAll(user.id);
      return accounts;
    } catch (error) {
      throw new InternalServerErrorException('Error getting accounts', error);
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const account = await this.accountRepository.findOne(id, user.id);
      return account;
    } catch (error) {
      throw new InternalServerErrorException('Error getting account', error);
    }
  }

  async update(id: string, req: any, updateAccountDto: UpdateAccountDto) {
    try {
      const user = await this.usersService.getUserProfile(req);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const account = await this.accountRepository.findOne(id, user.id);
      if (!account) {
        throw new NotFoundException('Account not found');
      }
     await this.accountRepository.update(
        id,
        updateAccountDto,
        user.id,
      );
      return {
        message: 'Account updated successfully',

      };
    } catch (error) {
      throw new InternalServerErrorException('Error updating account', error);
    }
  }

  async remove(id: string, userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const account = await this.accountRepository.findOne(id, user.id);
      if (!account) {
        throw new NotFoundException('Account not found');
      }
      await this.accountRepository.remove(id, user.id);
      return {
        message: 'Account deleted successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('Error deleting account', error);
    }
  }
}
