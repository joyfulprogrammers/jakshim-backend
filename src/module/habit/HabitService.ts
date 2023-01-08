import { Injectable } from '@nestjs/common';
import { TransactionService } from '../../entity/transaction/TransactionService';
import { HabitCreateRequest } from './dto/HabitCreateRequest';

@Injectable()
export class HabitService {
  constructor(private readonly transactionService: TransactionService) {}

  async createHabit(request: HabitCreateRequest): Promise<void> {
    await this.transactionService.transactional(async (manager) => {
      await manager.persistAndFlush(request);
    });
  }
}
