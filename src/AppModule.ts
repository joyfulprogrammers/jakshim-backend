import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import config from './config/mikro-orm.config';
import { RedisModule } from './module/redis/RedisModule';
import { UserModule } from './module/user/UserModule';

@Module({
  imports: [MikroOrmModule.forRoot(config), RedisModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
