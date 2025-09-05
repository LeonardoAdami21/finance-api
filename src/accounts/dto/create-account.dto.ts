import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';


enum AccountType {
    checking = 'checking',
    savings = 'savings',
    'credit-card' = 'credit-card',
    investing = 'investing',
}

export class CreateAccountDto {
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

  @ApiProperty({
    type: String,
    required: true,
    description: 'The type of the account',
  })
  @IsEnum(['checking', 'savings', 'credit-card', 'investing'])
  accountType: 'checking' | 'savings' | 'credit-card' | 'investing';
}
