import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsDateString,
  IsUUID,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ example: 'Salário' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 3000.5 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: '2025-09-04T10:00:00Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ enum: TransactionType, example: 'INCOME' })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({
    description: 'ID da conta associada',
    example: 'c1b9b9b0-c1b9-b9b0-c1b9-b9b0c1b9b9b0',
  })
  @IsUUID()
  accountId: string;

  @ApiProperty({
    description: 'ID da categoria (opcional)',
    example: 'd2a8c8c0-d2a8-c8c0-d2a8-c8c0d2a8c8c0',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
