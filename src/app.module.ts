import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/accounts.module';
import { CategoryModule } from './category/category.module';
import { TransactionsModule } from './transactions/transactions.module';
import { BudgetModule } from './budget/budget.module';
import { ReportsModule } from './reports/reports.module';
import { GoalsModule } from './goals/goals.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    AccountsModule,
    CategoryModule,
    TransactionsModule,
    BudgetModule,
    ReportsModule,
    GoalsModule,
  ],
})
export class AppModule {}
