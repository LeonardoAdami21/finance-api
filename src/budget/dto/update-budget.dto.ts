import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBudgetDto } from './create-budget.dto';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsDateString,
  IsUUID,
} from 'class-validator';

export class UpdateBudgetDto {
  @ApiProperty({ example: 'Orçamento Mensal de Mercado' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 800.0 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: '2025-09-01T00:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-09-30T23:59:59Z' })
  @IsDateString()
  endDate: string;

  @ApiProperty({
    description: 'ID da categoria para este orçamento',
    example: 'd2a8c8c0-d2a8-c8c0-d2a8-c8c0d2a8c8c0',
  })
  @IsUUID()
  categoryId: string;
}
