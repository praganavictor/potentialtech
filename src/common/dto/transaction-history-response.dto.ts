import { ApiProperty } from '@nestjs/swagger';
import { TransactionResponseDto } from './transaction-response.dto';
import { PaginationMetaDto } from './pagination-meta.dto';

export class TransactionHistoryResponseDto {
  @ApiProperty({
    description: 'List of transactions',
    type: [TransactionResponseDto],
  })
  data: TransactionResponseDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
}
