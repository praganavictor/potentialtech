import { IsNumber, IsPositive, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DepositDto {
  @ApiProperty({ example: 100.00, description: 'Valor do depósito (máximo 2 casas decimais)' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Max(999999999999.99)
  amount: number;
}
