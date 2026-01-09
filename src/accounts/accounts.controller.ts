import { Controller, Get, Patch, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('accounts')
@ApiBearerAuth()
@Controller('accounts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get('me')
  @ApiOperation({ summary: 'Obter minha conta' })
  @ApiResponse({ status: 200, description: 'Conta encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  findMyAccount(@CurrentUser() user: any) {
    return this.accountsService.findByUserId(user.userId);
  }

  @Get(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Obter conta por ID (Admin)' })
  @ApiResponse({ status: 200, description: 'Conta encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.findById(id);
  }

  @Patch(':id/block')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Bloquear conta (Admin)' })
  @ApiResponse({ status: 200, description: 'Conta bloqueada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  blockAccount(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.blockAccount(id);
  }

  @Patch(':id/unblock')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Desbloquear conta (Admin)' })
  @ApiResponse({ status: 200, description: 'Conta desbloqueada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  unblockAccount(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.unblockAccount(id);
  }
}
