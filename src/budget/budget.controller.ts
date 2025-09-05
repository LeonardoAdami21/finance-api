import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('budget')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @ApiOperation({
    summary: 'Create a new budget',
    description: 'Route to create a new budget',
  })
  @ApiCreatedResponse({ description: 'Budget created successfully' })
  @ApiBadRequestResponse({ description: 'Missing required fields' })
  @ApiConflictResponse({ description: 'Conflict with existing budget' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Post()
  create(@Body() createBudgetDto: CreateBudgetDto, @Request() req: any) {
    return this.budgetService.create(createBudgetDto, req.user.id);
  }

  @ApiOperation({
    summary: 'Get all budgets',
    description: 'Route to get all budgets',
  })
  @ApiOkResponse({ description: 'Budgets found successfully' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Get()
  findAll(@Request() req: any) {
    return this.budgetService.findAll(req.user.id);
  }

  @ApiOperation({
    summary: 'Get a specific budget',
    description: 'Route to get a specific budget',
  })
  @ApiOkResponse({ description: 'Budget found successfully' })
  @ApiNotFoundResponse({ description: 'Budget not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.budgetService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
    @Request() req: any,
  ) {
    return this.budgetService.update(id, updateBudgetDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.budgetService.remove(id, req.user.id);
  }
}
