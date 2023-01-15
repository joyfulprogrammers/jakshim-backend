import { CustomMigrationGenerator } from './CustomMigrationGenerator';
import { CustomNamingStrategy } from './CustomNamingStrategy';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

const config: MikroOrmModuleOptions = {
  debug: true,
  type: 'postgresql',
  host: 'localhost',
  user: 'test',
  password: 'test',
  dbName: 'test',
  port: 5440,
  metadataProvider: TsMorphMetadataProvider,
  autoLoadEntities: true,
  entities: ['../entity/domain'],
  entitiesTs: ['../entity/domain'],
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
