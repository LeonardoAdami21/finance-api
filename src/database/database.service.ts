import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly prisma: PrismaClient) {}

  async onModuleInit() {
    const result = await this.prisma.$connect();
    return result;
  }

  async onModuleDestroy() {
    const result = await this.prisma.$disconnect();
    return result;
  }
}
