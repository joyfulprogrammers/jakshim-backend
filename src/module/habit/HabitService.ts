import { Injectable } from '@nestjs/common';

@Injectable()
export class HabitService {
  async createHabit(): Promise<void> {
    return Promise.resolve();
  }
}
