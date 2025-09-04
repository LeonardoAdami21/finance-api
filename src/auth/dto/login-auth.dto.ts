import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({
    description: 'The email of the user',
    example: '9H2H2@example.com',
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: '123456',
    type: String,
  })
  @IsNotEmpty()
  password: string;
}
