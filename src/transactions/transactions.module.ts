import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { BrasilApiService } from './services/brasilapi.service';
import { AccountsModule } from '../accounts/accounts.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    HttpModule,
    AccountsModule,
    AuditModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, BrasilApiService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
