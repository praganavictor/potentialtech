import { IsString, IsNumber, IsPositive, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InternalTransferDto {
  @ApiProperty({ example: '1234567890', description: 'Número da conta destino' })
  @IsString()
  toAccountNumber: string;

  @ApiProperty({ example: 200.00, description: 'Valor da transferência (máximo 2 casas decimais)' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Max(999999999999.99)
  amount: number;
}
