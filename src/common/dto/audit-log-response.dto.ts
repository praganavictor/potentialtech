import { ApiProperty } from '@nestjs/swagger';

export class AuditLogUserDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'User email',
    example: 'john@example.com',
  })
  email: string;
}

export class AuditLogResponseDto {
  @ApiProperty({
    description: 'Audit log ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: 'Action performed',
    example: 'DEPOSIT',
  })
  action: string;

  @ApiProperty({
    description: 'Resource affected',
    example: 'transaction',
  })
  resource: string;

  @ApiProperty({
    description: 'Additional metadata',
    example: { transactionId: 1, amount: 100 },
  })
  metadata: Record<string, unknown>;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User information',
    type: AuditLogUserDto,
    required: false,
  })
  user?: AuditLogUserDto;
}
