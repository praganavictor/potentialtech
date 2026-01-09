import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccountsService } from '../accounts/accounts.service';
import { AuditService } from '../audit/audit.service';
import { BrasilApiService } from './services/brasilapi.service';
import { TransactionType, AccountStatus } from '@prisma/client';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { InternalTransferDto } from './dto/internal-transfer.dto';
import { ExternalTransferDto } from './dto/external-transfer.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accountsService: AccountsService,
    private readonly auditService: AuditService,
    private readonly brasilApiService: BrasilApiService,
  ) {}

  async deposit(userId: number, depositDto: DepositDto) {
    const account = await this.accountsService.findByUserId(userId);

    if (account.status === AccountStatus.BLOCKED) {
      throw new BadRequestException('Account is blocked');
    }

    const transaction = await this.prisma.$transaction(async (tx) => {
      const newBalance = account.balance.toNumber() + depositDto.amount;

      const createdTransaction = await tx.transaction.create({
        data: {
          type: TransactionType.DEPOSIT,
          amount: depositDto.amount,
          destinationAccountId: account.id,
          balanceAfter: newBalance,
        },
      });

      await tx.account.update({
        where: { id: account.id },
        data: { balance: newBalance },
      });

      return createdTransaction;
    });

    await this.auditService.log(
      userId,
      'DEPOSIT',
      'transaction',
      {
        transactionId: transaction.id,
        amount: depositDto.amount,
        accountId: account.id,
      },
    );

    return transaction;
  }

  async withdraw(userId: number, withdrawDto: WithdrawDto) {
    const account = await this.accountsService.findByUserId(userId);

    if (account.status === AccountStatus.BLOCKED) {
      throw new BadRequestException('Account is blocked');
    }

    if (account.balance.toNumber() < withdrawDto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const transaction = await this.prisma.$transaction(async (tx) => {
      const newBalance = account.balance.toNumber() - withdrawDto.amount;

      const createdTransaction = await tx.transaction.create({
        data: {
          type: TransactionType.WITHDRAWAL,
          amount: withdrawDto.amount,
          sourceAccountId: account.id,
          balanceAfter: newBalance,
        },
      });

      await tx.account.update({
        where: { id: account.id },
        data: { balance: newBalance },
      });

      return createdTransaction;
    });

    await this.auditService.log(
      userId,
      'WITHDRAWAL',
      'transaction',
      {
        transactionId: transaction.id,
        amount: withdrawDto.amount,
        accountId: account.id,
      },
    );

    return transaction;
  }

  async internalTransfer(userId: number, transferDto: InternalTransferDto) {
    const sourceAccount = await this.accountsService.findByUserId(userId);

    if (sourceAccount.status === AccountStatus.BLOCKED) {
      throw new BadRequestException('Source account is blocked');
    }

    if (sourceAccount.balance.toNumber() < transferDto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const destinationAccount = await this.accountsService.findByAccountNumber(
      transferDto.toAccountNumber,
    );

    if (destinationAccount.status === AccountStatus.BLOCKED) {
      throw new BadRequestException('Destination account is blocked');
    }

    if (sourceAccount.id === destinationAccount.id) {
      throw new BadRequestException('Cannot transfer to the same account');
    }

    const transactions = await this.prisma.$transaction(async (tx) => {
      const sourceNewBalance = sourceAccount.balance.toNumber() - transferDto.amount;
      const destinationNewBalance = destinationAccount.balance.toNumber() + transferDto.amount;

      const sourceTransaction = await tx.transaction.create({
        data: {
          type: TransactionType.INTERNAL_TRANSFER,
          amount: transferDto.amount,
          sourceAccountId: sourceAccount.id,
          destinationAccountId: destinationAccount.id,
          balanceAfter: sourceNewBalance,
        },
      });

      const destinationTransaction = await tx.transaction.create({
        data: {
          type: TransactionType.INTERNAL_TRANSFER,
          amount: transferDto.amount,
          sourceAccountId: sourceAccount.id,
          destinationAccountId: destinationAccount.id,
          balanceAfter: destinationNewBalance,
        },
      });

      await tx.account.update({
        where: { id: sourceAccount.id },
        data: { balance: sourceNewBalance },
      });

      await tx.account.update({
        where: { id: destinationAccount.id },
        data: { balance: destinationNewBalance },
      });

      return [sourceTransaction, destinationTransaction];
    });

    await this.auditService.log(
      userId,
      'INTERNAL_TRANSFER',
      'transaction',
      {
        transactionIds: transactions.map(t => t.id),
        amount: transferDto.amount,
        sourceAccountId: sourceAccount.id,
        destinationAccountId: destinationAccount.id,
      },
    );

    return transactions;
  }

  async externalTransfer(userId: number, transferDto: ExternalTransferDto) {
    const account = await this.accountsService.findByUserId(userId);

    if (account.status === AccountStatus.BLOCKED) {
      throw new BadRequestException('Account is blocked');
    }

    if (account.balance.toNumber() < transferDto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    const bankInfo = await this.brasilApiService.validateBank(transferDto.bankCode);

    if (!bankInfo) {
      throw new BadRequestException('Invalid bank code');
    }

    const transaction = await this.prisma.$transaction(async (tx) => {
      const newBalance = account.balance.toNumber() - transferDto.amount;

      const createdTransaction = await tx.transaction.create({
        data: {
          type: TransactionType.EXTERNAL_TRANSFER,
          amount: transferDto.amount,
          sourceAccountId: account.id,
          externalBankCode: bankInfo.code,
          externalBankName: bankInfo.name,
          externalAgency: transferDto.agency,
          externalAccount: transferDto.accountNumber,
          externalCpf: transferDto.cpf,
          balanceAfter: newBalance,
        },
      });

      await tx.account.update({
        where: { id: account.id },
        data: { balance: newBalance },
      });

      return createdTransaction;
    });

    await this.auditService.log(
      userId,
      'EXTERNAL_TRANSFER',
      'transaction',
      {
        transactionId: transaction.id,
        amount: transferDto.amount,
        accountId: account.id,
        bankCode: bankInfo.code,
        bankName: bankInfo.name,
      },
    );

    return transaction;
  }

  async getHistory(userId: number, page: number = 1, limit: number = 50) {
    const account = await this.accountsService.findByUserId(userId);

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where: {
          OR: [
            { sourceAccountId: account.id },
            { destinationAccountId: account.id },
          ],
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transaction.count({
        where: {
          OR: [
            { sourceAccountId: account.id },
            { destinationAccountId: account.id },
          ],
        },
      }),
    ]);

    return {
      data: transactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAllTransactions(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          sourceAccount: {
            select: {
              id: true,
              accountNumber: true,
              userId: true,
            },
          },
          destinationAccount: {
            select: {
              id: true,
              accountNumber: true,
              userId: true,
            },
          },
        },
      }),
      this.prisma.transaction.count(),
    ]);

    return {
      data: transactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
