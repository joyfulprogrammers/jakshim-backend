import { HabitBadhabit } from 'src/entity/domain/habitBadhabit/HabitBadhabit.entity';
import { CustomMigrationGenerator } from './CustomMigrationGenerator';
import { CustomNamingStrategy } from './CustomNamingStrategy';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { ReflectMetadataProvider } from '@mikro-orm/core';
import * as dotenv from 'dotenv';

dotenv.config();

const config: MikroOrmModuleOptions = {
  debug: true,
  type: 'postgresql',
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  port: process.env.DB_NAME ? Number(process.env.DB_NAME) : 5432,
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
