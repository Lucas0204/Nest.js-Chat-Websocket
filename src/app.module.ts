import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatMessages } from './model/ChatMessages';

@Module({
  providers: [
    ChatGateway,
    {
      provide: ChatService,
      useValue: new ChatService(new ChatMessages())
    }
  ],
  exports: [ChatService]
})
export class AppModule {}
