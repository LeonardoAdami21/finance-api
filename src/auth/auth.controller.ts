import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RegisterAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Route to create a new user',
  })
  @ApiCreatedResponse({ description: 'User created successfully' })
  @ApiBadRequestResponse({ description: 'All fields are required' })
  @ApiInternalServerErrorResponse({ description: 'Error creating user' })
  @Post('register')
  create(@Body() dto: RegisterAuthDto) {
    return this.authService.create(dto);
  }

  @ApiOperation({
    summary: 'Login a user',
    description: 'Route to login a user',
  })
  @Post('login')
  @ApiCreatedResponse({ description: 'User logged in successfully' })
  @ApiBadRequestResponse({ description: 'All fields are required' })
  @ApiInternalServerErrorResponse({ description: 'Login failed' })
  login(@Body() dto: LoginAuthDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({
    summary: 'Get user profile',
    description: 'Route to get user profile',
  })
  @ApiOkResponse({ description: 'User profile retrieved successfully' })
  @ApiBadRequestResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Error getting user profile' })
  @Get('profile')
  getUserProfile(@Request() req: any) {
    return this.authService.getUserProfile(req.userId);
  }
}
