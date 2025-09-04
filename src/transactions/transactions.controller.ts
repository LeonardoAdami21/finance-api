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
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('transactions')
@ApiBearerAuth()
@ApiTags('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation({
    summary: 'Create a new transaction',
    description: 'Route to create a new transaction',
  })
  @ApiCreatedResponse({
    description: 'The transaction has been successfully created',
  })
  @ApiConflictResponse({ description: 'Amount must be greater than 0' })
  @ApiBadRequestResponse({ description: 'Missing required fields' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Error creating transaction' })
  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Request() req: any,
  ) {
    return this.transactionsService.create(createTransactionDto, req.user.id);
  }

  @ApiOperation({
    summary: 'Find all transactions',
    description: 'Route to find all transactions',
  })
  @ApiOkResponse({
    description: 'The transactions have been successfully found',
  })
  @ApiQuery({
    name: 'accountId',
    required: false,
    description: 'Filtra transações por ID da conta',
  })
  @ApiInternalServerErrorResponse({ description: 'Error getting transactions' })
  @Get()
  findAll(@Request() req: any, @Query('accountId') accountId?: string) {
    return this.transactionsService.findAll(req.user.id, accountId);
  }

  @ApiOperation({
    summary: 'Find one transaction',
    description: 'Route to find one transaction',
  })
  @ApiOkResponse({ description: 'The transaction has been successfully found' })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  @ApiInternalServerErrorResponse({ description: 'Error getting transaction' })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.transactionsService.findOne(id, req.user.id);
  }

  @ApiOperation({
    summary: 'Update one transaction',
    description: 'Route to update one transaction',
  })
  @ApiOkResponse({
    description: 'The transaction has been successfully updated',
  })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  @ApiInternalServerErrorResponse({ description: 'Error updating transaction' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Request() req: any,
  ) {
    return this.transactionsService.update(
      id,
      updateTransactionDto,
      req.user.id,
    );
  }

  @ApiOperation({
    summary: 'Delete one transaction',
    description: 'Route to delete one transaction',
  })
  @ApiOkResponse({
    description: 'The transaction has been successfully deleted',
  })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  @ApiInternalServerErrorResponse({ description: 'Error deleting transaction' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.transactionsService.remove(id, req.user.id);
  }
}
