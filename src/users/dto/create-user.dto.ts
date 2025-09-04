import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'John Doe',
    description: 'The name of the user',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '9H2H2@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
