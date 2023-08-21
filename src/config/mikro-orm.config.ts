import { HabitBadhabit } from 'src/entity/domain/habitBadhabit/HabitBadhabit.entity';
import { CustomMigrationGenerator } from './CustomMigrationGenerator';
import { CustomNamingStrategy } from './CustomNamingStrategy';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { ReflectMetadataProvider } from '@mikro-orm/core';

const config: MikroOrmModuleOptions = {
  debug: true,
  type: 'postgresql',
  host: process.env.DB_HOST ?? 'localhost',
  user: process.env.DB_USER ?? 'test',
  password: process.env.DB_PASSWORD ?? 'test',
  dbName: process.env.DB_NAME ?? 'test',
  port: 5432,
  metadataProvider: ReflectMetadataProvider,
  autoLoadEntities: true,
  entities: ['../entity/domain', HabitBadhabit],
  entitiesTs: ['../entity/domain', HabitBadhabit],
  namingStrategy: CustomNamingStrategy,
  allowGlobalContext: true, // 개발 환경이라면 true
  schemaGenerator: {
    createForeignKeyConstraints: false,
  },
  migrations: {
    disableForeignKeys: true,
    path: '../../scripts/migrations',
    pathTs: '../../scripts/migrations',
    generator: CustomMigrationGenerator,
  },
  driverOptions: {
    connection: {
      statement_timeout: 1000,
    },
  },
  pool: {
    min: 20,
    max: 20,
  },
};

export default config;
