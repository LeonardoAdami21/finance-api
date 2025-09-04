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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
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

@Controller('category')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    summary: 'Create a new category',
    description: ' Route to create a new category',
  })
  @ApiCreatedResponse({
    description: 'The category has been successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'Name is required',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error creating category',
  })
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto, @Request() req: any) {
    return this.categoryService.create(createCategoryDto, req.user.id);
  }

  @ApiOperation({
    summary: 'Get all categories',
    description: 'Route to get all categories',
  })
  @ApiOkResponse({
    description: 'The categories have been successfully retrieved.',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error getting categories',
  })
  @Get()
  findAll(@Request() req: any) {
    return this.categoryService.findAll(req.user.id);
  }

  @ApiOperation({
    summary: 'Get one category',
    description: 'Route to get one category',
  })
  @ApiOkResponse({
    description: 'The category has been successfully retrieved.',
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error getting category',
  })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.categoryService.findOne(id, req.user.id);
  }

  @ApiOperation({
    summary: 'Update one category',
    description: 'Route to update one category',
  })
  @ApiOkResponse({
    description: 'The category has been successfully updated.',
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  @ApiBadRequestResponse({
    description: 'Name is required',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error updating category',
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Request() req: any,
  ) {
    return this.categoryService.update(id, updateCategoryDto, req.user.id);
  }

  @ApiOperation({
    summary: 'Delete one category',
    description: 'Route to delete one category',
  })
  @ApiOkResponse({
    description: 'The category has been successfully deleted.',
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  @ApiInternalServerErrorResponse({
    description: 'Error deleting category',
  })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.categoryService.remove(id, req.user.id);
  }
}
