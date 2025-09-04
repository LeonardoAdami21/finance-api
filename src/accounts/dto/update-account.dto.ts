import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAccountDto } from './create-account.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateAccountDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'The name of the account',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: Number,
    required: true,
    description: 'The balance of the account',
  })
  @IsNumber()
  balance: number;
}
