import { Injectable } from '@nestjs/common';
import { HabitCreateRequest } from './dto/HabitCreateRequest';

@Injectable()
export class HabitService {
  async createHabit(request: HabitCreateRequest): Promise<void> {
    return Promise.resolve();
  }
}
