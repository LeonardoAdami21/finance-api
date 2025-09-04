import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    const result = await this.$connect();
    return result;
  }

  async onModuleDestroy() {
    const result = await this.$disconnect();
    return result;
  }
}
