import { Controller, Post, Get, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { InternalTransferDto } from './dto/internal-transfer.dto';
import { ExternalTransferDto } from './dto/external-transfer.dto';

@ApiTags('transactions')
@ApiBearerAuth()
@Controller('transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('deposit')
  @ApiOperation({ summary: 'Realizar depósito' })
  @ApiResponse({ status: 201, description: 'Depósito realizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  deposit(@CurrentUser() user: any, @Body() depositDto: DepositDto) {
    return this.transactionsService.deposit(user.userId, depositDto);
  }

  @Post('withdraw')
  @ApiOperation({ summary: 'Realizar saque' })
  @ApiResponse({ status: 201, description: 'Saque realizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Saldo insuficiente ou dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Conta bloqueada' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  withdraw(@CurrentUser() user: any, @Body() withdrawDto: WithdrawDto) {
    return this.transactionsService.withdraw(user.userId, withdrawDto);
  }

  @Post('transfer/internal')
  @ApiOperation({ summary: 'Realizar transferência interna' })
  @ApiResponse({ status: 201, description: 'Transferência realizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Saldo insuficiente ou dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Conta bloqueada' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  internalTransfer(@CurrentUser() user: any, @Body() transferDto: InternalTransferDto) {
    return this.transactionsService.internalTransfer(user.userId, transferDto);
  }

  @Post('transfer/external')
  @ApiOperation({ summary: 'Realizar transferência externa' })
  @ApiResponse({ status: 201, description: 'Transferência realizada com sucesso' })
  @ApiResponse({ status: 400, description: 'Saldo insuficiente ou dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Conta bloqueada' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  externalTransfer(@CurrentUser() user: any, @Body() transferDto: ExternalTransferDto) {
    return this.transactionsService.externalTransfer(user.userId, transferDto);
  }

  @Get('history')
  @ApiOperation({ summary: 'Obter histórico de transações' })
  @ApiResponse({ status: 200, description: 'Histórico recuperado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  getHistory(
    @CurrentUser() user: any,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 50,
  ) {
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const safePage = Math.max(page, 1);
    return this.transactionsService.getHistory(user.userId, safePage, safeLimit);
  }

  @Get()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Obter todas as transações (Admin)' })
  @ApiResponse({ status: 200, description: 'Transações recuperadas com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  getAllTransactions(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 50,
  ) {
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const safePage = Math.max(page, 1);
    return this.transactionsService.getAllTransactions(safePage, safeLimit);
  }
}
