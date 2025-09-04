import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UsersService } from 'src/users/users.service';
import { AccountType } from '@prisma/client';

@Injectable()
export class AccountRepository {
  constructor(
    private readonly accountRepository: DatabaseService,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateAccountDto, req: any) {
    try {
      const { name, balance, accountType } = dto;
      if (!name || !balance || !accountType) {
        throw new Error('All fields are required');
      }
      const user = await this.usersService.getUserProfile(req);
      if (!user) {
        throw new Error('User not found');
      }
      const account = await this.accountRepository.account.create({
        data: {
          name,
          balance,
          type: AccountType[accountType],
          userId: user.id,
        },
      });
      return account;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAll(req: any) {
    try {
      const user = await this.usersService.getUserProfile(req);
      if (!user) {
        throw new Error('User not found');
      }
      const accounts = await this.accountRepository.account.findMany({
        where: {
          userId: user.id,
        },
      });
      return accounts;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(id: string, userId: string) {
    try {
      const account = await this.accountRepository.account.findUnique({
        where: {
          id,
        },
      });
      if (!account) {
        throw new Error('Account not found');
      }
      if (account.userId !== userId) {
        throw new Error('Account not found');
      }
      return account;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: string, updateAccountDto: any, userId: string) {
    try {
      const user = await this.usersService.getUserProfile(userId);
      if (!user) {
        throw new Error('User not found');
      }
      await this.accountRepository.account.update({
        where: {
          id,
        },
        data: {
          name: updateAccountDto.name,
          balance: updateAccountDto.balance
        },
      });
      return {
        message: 'Account updated successfully',
      };
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
      await this.accountRepository.account.delete({
        where: {
          id,
        },
      });
      return {
        message: 'Account deleted successfully',
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
