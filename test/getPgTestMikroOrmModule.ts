import { CustomMigrationGenerator } from 'src/config/CustomMigrationGenerator';
import { CustomNamingStrategy } from 'src/config/CustomNamingStrategy';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

export function getPgTestMikroOrmModule() {
  const connectionTimeout = 2000; // 2초

  return MikroOrmModule.forRoot({
    type: 'postgresql',
    host: 'localhost',
    user: 'test',
    password: 'test',
    dbName: 'test',
    port: 5440,
    metadataProvider: TsMorphMetadataProvider,
    autoLoadEntities: true,
    namingStrategy: CustomNamingStrategy,
    schemaGenerator: {
      createForeignKeyConstraints: false,
    },
    migrations: {
      disableForeignKeys: true,
      path: 'scripts/migrations',
      pathTs: 'scripts/migrations',
      generator: CustomMigrationGenerator,
    },
    replicas: [{ host: 'localhost' }],
    driverOptions: {
      connection: {
        statement_timeout: connectionTimeout,
      },
    },
    pool: {
      min: 1,
      max: 5,
    },
    allowGlobalContext: true,
    debug: false,
  });
}
