import { ApiProperty } from '@nestjs/swagger';
import { AccountStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class AccountResponseDto {
  @ApiProperty({
    description: 'Account ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: 'Account number',
    example: '1234567890',
  })
  accountNumber: string;

  @ApiProperty({
    description: 'Account balance',
    example: 1000.00,
    type: Number,
  })
  balance: Decimal;

  @ApiProperty({
    description: 'Account status',
    enum: AccountStatus,
    example: AccountStatus.ACTIVE,
  })
  status: AccountStatus;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  updatedAt?: Date;
}
