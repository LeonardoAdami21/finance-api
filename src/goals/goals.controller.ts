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
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
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
import { User } from '@prisma/client';
import { ContributeToGoalDto } from './dto/contribute-to-goal.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@ApiTags('Goals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @ApiOperation({
    summary: 'Create a new goal',
    description: 'Route to create a new goal',
  })
  @ApiCreatedResponse({ description: 'Goal created successfully' })
  @ApiBadRequestResponse({ description: 'All fields are required' })
  @ApiInternalServerErrorResponse({ description: 'Error creating goal' })
  @Post()
  create(@Body() createGoalDto: CreateGoalDto, @Request() req: any) {
    return this.goalsService.create(createGoalDto, req.user.id);
  }

  @ApiOperation({
    summary: 'Get all goals',
    description: 'Route to get all goals',
  })
  @ApiOkResponse({ description: 'Goals found successfully' })
  @ApiInternalServerErrorResponse({ description: 'Error getting goals' })
  @Get()
  findAll(@Request() req: any) {
    return this.goalsService.findAll(req.user.id);
  }

  @ApiOperation({
    summary: 'Get one goal',
    description: 'Route to get one goal',
  })
  @ApiOkResponse({ description: 'Goal found successfully' })
  @ApiNotFoundResponse({ description: 'Goal not found' })
  @ApiInternalServerErrorResponse({ description: 'Error getting goal' })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.goalsService.findOne(id, req.user.id);
  }

  @ApiOperation({
    summary: 'Update a goal',
    description: 'Route to update a goal',
  })
  @ApiOkResponse({ description: 'Goal updated successfully' })
  @ApiBadRequestResponse({ description: 'All fields are required' })
  @ApiNotFoundResponse({ description: 'Goal not found' })
  @ApiInternalServerErrorResponse({ description: 'Error updating goal' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGoalDto: UpdateGoalDto,
    @Request() req: any,
  ) {
    return this.goalsService.update(id, updateGoalDto, req.user.id);
  }

  @ApiOperation({
    summary: 'Delete a goal',
    description: 'Route to delete a goal',
  })
  @ApiOkResponse({ description: 'Goal deleted successfully' })
  @ApiNotFoundResponse({ description: 'Goal not found' })
  @ApiInternalServerErrorResponse({ description: 'Error deleting goal' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.goalsService.remove(id, req.user.id);
  }

  @ApiOperation({
    summary: 'Contribute to a goal',
    description: 'Route to contribute to a goal',
  })
  @ApiCreatedResponse({ description: 'Goal contributed successfully' })
  @ApiBadRequestResponse({ description: 'All fields are required' })
  @ApiNotFoundResponse({ description: 'Goal not found' })
  @ApiInternalServerErrorResponse({ description: 'Error contributing to goal' })
  @Post(':id/contribute')
  contribute(
    @Param('id') id: string,
    @Body() contributeDto: ContributeToGoalDto,
    @Request() req: any,
  ) {
    return this.goalsService.contribute(id, contributeDto, req.user.id);
  }
}
