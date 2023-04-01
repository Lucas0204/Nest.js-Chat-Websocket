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
import { ChatService } from './chat.service';
import { Inject } from '@nestjs/common';

export interface UserData {
    id: string;
    name?: string;
    roomName?: string;
    roomId?: number;
}

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private users: UserData[];

    @WebSocketServer()
    private wss: Server;

    @Inject(ChatService)
    private readonly chatService: ChatService;

    constructor() {
        this.users = [];
    }

    handleConnection(client: Socket) {
        this.users.push({ id: client.id });
        console.log('connected');
    }

    handleDisconnect(client: Socket) {
        const userIndex = this.users.findIndex(user => user.id === client.id);
        const userRoom = this.users[userIndex].roomName;

        client.leave(userRoom);
        this.users.splice(userIndex, 1);
    }

    @SubscribeMessage('join_room')
    async joinRoom(
        @MessageBody() data: { username: string; roomId: number; },
        @ConnectedSocket() socket: Socket
    ) {
        const roomName = `room-${data.roomId}`;
        socket.join(roomName);

        const user = this.users.find(user => user.id === socket.id);

        user.name = data.username;
        user.roomId = data.roomId;
        user.roomName = roomName;

        const messages = await this.chatService.getRoomMessages(data.roomId);

        return { status: 'Ok!', roomId: data.roomId, messages };
    }

    @SubscribeMessage('room_message')
    async handleMessage(
        @MessageBody() data: { message: string; },
        @ConnectedSocket() socket: Socket
    ) {
        const user = this.users.find(user => user.id === socket.id);
        socket.to(user.roomName).emit('message', { message: data.message, username: user.name });

        await this.chatService.saveMessage({
            message: data.message,
            username: user.name,
            room_id: user.roomId
        });
    }
}
