import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getPgRealTypeOrmModule } from './module/typeorm/getPgRealTypeOrmModule';
import { UserModule } from './module/user/UserModule';

@Module({
  imports: [getPgRealTypeOrmModule(), UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
