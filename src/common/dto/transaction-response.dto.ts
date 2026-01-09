import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class TransactionResponseDto {
  @ApiProperty({
    description: 'Transaction ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Transaction type',
    enum: TransactionType,
    example: TransactionType.DEPOSIT,
  })
  type: TransactionType;

  @ApiProperty({
    description: 'Transaction amount',
    example: 100.00,
    type: Number,
  })
  amount: Decimal;

  @ApiProperty({
    description: 'Source account ID',
    example: 1,
    required: false,
  })
  sourceAccountId?: number;

  @ApiProperty({
    description: 'Destination account ID',
    example: 2,
    required: false,
  })
  destinationAccountId?: number;

  @ApiProperty({
    description: 'External bank code',
    example: '001',
    required: false,
  })
  externalBankCode?: string;

  @ApiProperty({
    description: 'External bank name',
    example: 'Banco do Brasil',
    required: false,
  })
  externalBankName?: string;

  @ApiProperty({
    description: 'External agency',
    example: '1234',
    required: false,
  })
  externalAgency?: string;

  @ApiProperty({
    description: 'External account',
    example: '12345678',
    required: false,
  })
  externalAccount?: string;

  @ApiProperty({
    description: 'External CPF',
    example: '12345678901',
    required: false,
  })
  externalCpf?: string;

  @ApiProperty({
    description: 'Balance after transaction',
    example: 1100.00,
    type: Number,
  })
  balanceAfter: Decimal;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}
