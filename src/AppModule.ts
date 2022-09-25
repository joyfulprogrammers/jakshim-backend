import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getPgRealTypeOrmModule } from './module/typeorm/getPgRealTypeOrmModule';

@Module({
  imports: [getPgRealTypeOrmModule()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
