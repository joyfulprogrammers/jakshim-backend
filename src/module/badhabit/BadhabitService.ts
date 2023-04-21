import { TransactionService } from 'src/entity/transaction/TransactionService';
import { Injectable } from '@nestjs/common';
import { Badhabit } from 'src/entity/domain/badhabit/Badhabit.entity';

@Injectable()
export class BadhabitService {
  constructor(
    private readonly transactionService: TransactionService, // private readonly badhabitQueryRepository: BadhabitQueryRepository,
  ) {}

  async create(userId: number, name: string) {
    const badhabit = Badhabit.create(userId, name);

    await this.transactionService.transactional(async (manager) => {
      await manager.persistAndFlush(badhabit);
    });

    return badhabit;
  }
}
