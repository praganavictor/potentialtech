import { ApiProperty } from '@nestjs/swagger';
import { AuditLogResponseDto } from './audit-log-response.dto';
import { PaginationMetaDto } from './pagination-meta.dto';

export class AuditLogsResponseDto {
  @ApiProperty({
    description: 'List of audit logs',
    type: [AuditLogResponseDto],
  })
  data: AuditLogResponseDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;
}
