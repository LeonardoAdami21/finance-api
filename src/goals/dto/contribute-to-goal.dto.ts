import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, IsUUID } from 'class-validator';

export class ContributeToGoalDto {
  @ApiProperty({ example: 100.0 })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ description: 'ID da conta de onde o dinheiro sairá' })
  @IsUUID()
  fromAccountId: string;
}
