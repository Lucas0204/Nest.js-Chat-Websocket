import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    MessageBody,
    ConnectedSocket,
    WebSocketServer
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private users: { id: string; }[];

    @WebSocketServer()
    private wss: Server;

    constructor() {
        this.users = [];
    }

    handleConnection(client: Socket) {
        this.users.push({ id: client.id });
        console.log('connected');
    }

    handleDisconnect(client: Socket) {
        const userIndex = this.users.findIndex(user => user.id === client.id);
        this.users.splice(userIndex);
    }

    @SubscribeMessage('message')
    async handleMessage(
        @MessageBody() data: {},
        @ConnectedSocket() socket: Socket
    ) {
        this.wss.emit('chat_message', data);
    }
}
