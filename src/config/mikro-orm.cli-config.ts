import { HabitBadhabit } from 'src/entity/domain/habitBadhabit/HabitBadhabit.entity';
import { CustomMigrationGenerator } from './CustomMigrationGenerator';
import { CustomNamingStrategy } from './CustomNamingStrategy';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

const config: MikroOrmModuleOptions = {
  type: 'postgresql',
  host: 'localhost',
  user: 'test',
  password: 'test',
  dbName: 'test',
  port: 5440,
  metadataProvider: TsMorphMetadataProvider,
  entities: ['src/entity/domain/**/*.entity.ts', HabitBadhabit],
  entitiesTs: ['src/entity/domain/**/*.entity.ts', HabitBadhabit],
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
};

export default config;
