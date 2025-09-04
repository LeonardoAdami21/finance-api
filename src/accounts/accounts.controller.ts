import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('accounts')
@ApiBearerAuth()
@ApiTags('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @ApiOperation({
    summary: 'Create a new account',
    description: 'Route to create a new account',
  })
  @ApiCreatedResponse({ description: 'Account created successfully' })
  @ApiBadRequestResponse({ description: 'All fields are required' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Error creating account' })
  @Post()
  create(@Body() createAccountDto: CreateAccountDto, @Request() req: any) {
    return this.accountsService.create(createAccountDto, req.user.id);
  }

  @ApiOperation({
    summary: 'Get all accounts',
    description: 'Route to get all accounts',
  })
  @ApiOkResponse({ description: 'Accounts found successfully' })
  @ApiInternalServerErrorResponse({ description: 'Error getting accounts' })
  @Get()
  findAll(@Request() req: any) {
    return this.accountsService.findAll(req.user.id);
  }

  @ApiOperation({
    summary: 'Get one account',
    description: 'Route to get one account',
  })
  @ApiOkResponse({ description: 'Account found successfully' })
  @ApiNotFoundResponse({ description: 'Account not found' })
  @ApiInternalServerErrorResponse({ description: 'Error getting account' })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.accountsService.findOne(id, req.user.id);
  }

  @ApiOperation({
    summary: 'Update one account',
    description: 'Route to update one account',
  })
  @ApiOkResponse({ description: 'Account updated successfully' })
  @ApiNotFoundResponse({ description: 'Account not found' })
  @ApiInternalServerErrorResponse({ description: 'Error updating account' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
    @Request() req: any,
  ) {
    return this.accountsService.update(id, req.user.id, updateAccountDto);
  }

  @ApiOperation({
    summary: 'Delete one account',
    description: 'Route to delete one account',
  })
  @ApiOkResponse({ description: 'Account deleted successfully' })
  @ApiNotFoundResponse({ description: 'Account not found' })
  @ApiInternalServerErrorResponse({ description: 'Error deleting account' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.accountsService.remove(id, req.user.id);
  }
}
