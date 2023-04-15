import { TransactionService } from 'src/entity/transaction/TransactionService';
import { BadhabitQueryRepository } from './BadhabitQueryRepository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BadhabitService {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly badhabitQueryRepository: BadhabitQueryRepository,
  ) {}
}
