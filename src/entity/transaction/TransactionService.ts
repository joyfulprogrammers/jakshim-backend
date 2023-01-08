import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

export type TransactionFunction<T = void> = (
  manager: EntityManager,
) => Promise<T>;

@Injectable()
export class TransactionService {
  constructor(private entityManager: EntityManager) {}

  async transactional<T>(fn: TransactionFunction<T>): Promise<T> {
    return this.entityManager.transactional(fn);
  }
}
