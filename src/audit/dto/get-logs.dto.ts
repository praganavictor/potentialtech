import { IsOptional, IsInt, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetLogsDto {
  @ApiProperty({ example: 1, description: 'ID do usuário para filtrar logs', required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  userId?: number;

  @ApiProperty({ example: 'LOGIN', description: 'Ação para filtrar logs', required: false })
  @IsOptional()
  @IsString()
  action?: string;

  @ApiProperty({ example: '2024-01-01T00:00:00Z', description: 'Data inicial para filtro', required: false })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiProperty({ example: '2024-12-31T23:59:59Z', description: 'Data final para filtro', required: false })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiProperty({ example: 1, description: 'Número da página', required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ example: 50, description: 'Quantidade de registros por página', required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  limit?: number = 50;
}
