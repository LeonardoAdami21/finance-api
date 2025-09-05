import { forwardRef, Module } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { GoalsController } from './goals.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { GoalRepository } from './repository/goal.repository';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => UsersModule), forwardRef(() => AccountsModule)],
  controllers: [GoalsController],
  providers: [GoalsService, GoalRepository],
})
export class GoalsModule {}
