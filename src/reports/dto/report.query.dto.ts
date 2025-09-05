import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';

export class ReportQueryDto {
  @ApiPropertyOptional({
    description: 'Data de início para o filtro (formato ISO 8601)',
    example: '2025-09-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({
    description: 'Data final para o filtro (formato ISO 8601)',
    example: '2025-09-30T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString()
  endDate: string;
}
