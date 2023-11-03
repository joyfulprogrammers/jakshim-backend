import { CustomMigrationGenerator } from './CustomMigrationGenerator';
import { CustomNamingStrategy } from './CustomNamingStrategy';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { ReflectMetadataProvider } from '@mikro-orm/core';
import * as dotenv from 'dotenv';
import { EntityModule } from '../entity/domain/EntityModule';

dotenv.config();

const config: MikroOrmModuleOptions = {
  debug: true,
  type: 'postgresql',
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  port: process.env.PORT ? Number(process.env.PORT) : 5432,
  metadataProvider: ReflectMetadataProvider,
  autoLoadEntities: true,
  namingStrategy: CustomNamingStrategy,
  allowGlobalContext: true, // 개발 환경이라면 true
  schemaGenerator: {
    createForeignKeyConstraints: false,
  },
  entities: [EntityModule],
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
