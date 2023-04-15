import { Module } from '@nestjs/common';
import { BadhabitEntityModule } from 'src/entity/domain/badhabit/BadhabitEntityModule';
import { BadhabitController } from './BadhabitController';
import { BadhabitService } from './BadhabitService';
import { BadhabitQueryRepository } from './BadhabitQueryRepository';
import { TransactionService } from 'src/entity/transaction/TransactionService';

@Module({
  imports: [BadhabitEntityModule],
  controllers: [BadhabitController],
  providers: [BadhabitService, BadhabitQueryRepository, TransactionService],
})
export class BadhabitApiModule {}
