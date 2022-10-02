import { TypeOrmModule } from '@nestjs/typeorm';

import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { User } from '../../entity/domain/user/User.entity';
import { Achievement } from '../../entity/domain/achievement/Achievement.entity';
import { Habits } from '../../entity/domain/habits/Habits.entity';

export function getPgRealTypeOrmModule() {
  return TypeOrmModule.forRoot({
    maxQueryExecutionTime: 1000,
    extra: {
      statement_timeout: 1000,
      min: 20,
      max: 20,
    },
    type: 'postgres',
    entities: [Achievement, Habits, User],
    autoLoadEntities: true,
    synchronize: true,
    logging: false,
    namingStrategy: new SnakeNamingStrategy(),
    host: 'localhost',
    port: 5440,
    username: 'test',
    password: 'test',
    database: 'test',
  });
}
