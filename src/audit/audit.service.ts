import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetLogsDto } from './dto/get-logs.dto';
import { AuditLogsResponseDto } from '../common/dto/audit-logs-response.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(userId: number, action: string, resource: string, metadata?: Record<string, unknown>) {
    return this.prisma.auditLog.create({
      data: {
        userId,
        action,
        resource,
        metadata: (metadata || {}) as Prisma.InputJsonValue,
      },
    });
  }

  async getLogs(filters: GetLogsDto): Promise<AuditLogsResponseDto> {
    const { userId, action, dateFrom, dateTo, page = 1, limit = 50 } = filters;

    const where: Prisma.AuditLogWhereInput = {};

    if (userId) {
      where.userId = userId;
    }

    if (action) {
      where.action = action;
    }

    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo);
      }
    }

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data: logs.map(log => ({
        ...log,
        metadata: log.metadata as Record<string, unknown>,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
