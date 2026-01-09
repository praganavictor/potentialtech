import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccountStatus } from '@prisma/client';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number) {
    const existingAccount = await this.prisma.account.findUnique({
      where: { userId },
    });

    if (existingAccount) {
      throw new BadRequestException('User already has an account');
    }

    const accountNumber = await this.generateUniqueAccountNumber();

    return this.prisma.account.create({
      data: {
        userId,
        accountNumber,
        balance: 0,
        status: AccountStatus.ACTIVE,
      },
    });
  }

  async findByUserId(userId: number) {
    const account = await this.prisma.account.findUnique({
      where: { userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async findByAccountNumber(accountNumber: string) {
    const account = await this.prisma.account.findUnique({
      where: { accountNumber },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async findById(id: number) {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async updateBalance(id: number, amount: number, operation: 'increment' | 'decrement') {
    const account = await this.findById(id);

    if (operation === 'decrement' && account.balance.toNumber() < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    return this.prisma.account.update({
      where: { id },
      data: {
        balance: {
          [operation]: amount,
        },
      },
    });
  }

  async blockAccount(id: number) {
    const account = await this.findById(id);

    if (account.status === AccountStatus.BLOCKED) {
      throw new BadRequestException('Account is already blocked');
    }

    return this.prisma.account.update({
      where: { id },
      data: { status: AccountStatus.BLOCKED },
    });
  }

  async unblockAccount(id: number) {
    const account = await this.findById(id);

    if (account.status === AccountStatus.ACTIVE) {
      throw new BadRequestException('Account is already active');
    }

    return this.prisma.account.update({
      where: { id },
      data: { status: AccountStatus.ACTIVE },
    });
  }

  private generateAccountNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(1000 + Math.random() * 9000).toString();
    return timestamp + random;
  }

  private async generateUniqueAccountNumber(): Promise<string> {
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      const accountNumber = this.generateAccountNumber();
      const exists = await this.prisma.account.findUnique({
        where: { accountNumber },
      });

      if (!exists) {
        return accountNumber;
      }
      attempts++;
    }

    throw new Error('Failed to generate unique account number after 5 attempts');
  }
}
