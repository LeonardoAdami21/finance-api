import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateGoalDto {
  @ApiProperty({ example: 'Viagem para a praia' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 5000.0 })
  @IsNumber()
  @IsPositive()
  targetAmount: number;

  @ApiPropertyOptional({ example: '2026-12-31T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  deadline?: string;
}
