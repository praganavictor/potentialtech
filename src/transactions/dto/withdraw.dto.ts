import { IsNumber, IsPositive, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WithdrawDto {
  @ApiProperty({ example: 50.00, description: 'Valor do saque (máximo 2 casas decimais)' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Max(999999999999.99)
  amount: number;
}
