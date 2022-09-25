import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export function getPgRealTypeOrmModule() {
  const entityPath = path.join(__dirname, '../../entity/domain/**/*.entity.ts');

  return TypeOrmModule.forRoot({
    maxQueryExecutionTime: 1000,
    extra: {
      statement_timeout: 1000,
      min: 20,
      max: 20,
    },
    type: 'postgres',
    entities: [entityPath],
    autoLoadEntities: true,
    synchronize: false,
    logging: false,
    namingStrategy: new SnakeNamingStrategy(),
    host: 'localhost',
    port: 5440,
    username: 'test',
    password: 'test',
    database: 'test',
  });
}
