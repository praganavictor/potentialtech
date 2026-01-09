import { IsString, IsNumber, IsPositive, Max, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExternalTransferDto {
  @ApiProperty({ example: '001', description: 'Código do banco (3 dígitos)' })
  @IsString()
  @Length(3, 3)
  bankCode: string;

  @ApiProperty({ example: '1234', description: 'Número da agência' })
  @IsString()
  agency: string;

  @ApiProperty({ example: '12345678', description: 'Número da conta' })
  @IsString()
  accountNumber: string;

  @ApiProperty({ example: '12345678901', description: 'CPF do destinatário (11 dígitos)' })
  @IsString()
  @Length(11, 11)
  cpf: string;

  @ApiProperty({ example: 300.00, description: 'Valor da transferência (máximo 2 casas decimais)' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Max(999999999999.99)
  amount: number;
}
