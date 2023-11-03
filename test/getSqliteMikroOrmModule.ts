import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { CustomNamingStrategy } from 'src/config/CustomNamingStrategy';
import { EntityModule } from '../src/entity/domain/EntityModule';

export function getSqliteMikroOrmModule() {
  return MikroOrmModule.forRoot({
    type: 'better-sqlite',
    dbName: ':memory:',
    metadataProvider: TsMorphMetadataProvider,
    namingStrategy: CustomNamingStrategy,
    schemaGenerator: {
      createForeignKeyConstraints: false,
    },
    entities: [EntityModule],
    autoLoadEntities: true,
    allowGlobalContext: true,
    debug: false,
  });
}
