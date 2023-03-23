import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';

@Module({
  imports: [AppGateway],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
