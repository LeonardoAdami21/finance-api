import { forwardRef, Module } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { CategoryModule } from 'src/category/category.module';
import { BudgetRepository } from './repository/budget.repository';

@Module({
  imports: [DatabaseModule, forwardRef(() => UsersModule), forwardRef(() => CategoryModule)],
  controllers: [BudgetController],
  providers: [BudgetService, BudgetRepository],
})
export class BudgetModule {}
