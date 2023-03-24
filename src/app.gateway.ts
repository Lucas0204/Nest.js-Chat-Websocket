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
    private users: { id: string; roomName?: string; }[];

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
        const userRoom = this.users[userIndex].roomName;

        client.leave(userRoom);
        this.users.splice(userIndex);
    }

    @SubscribeMessage('join_room')
    async joinRoom(
        @MessageBody() data: { roomId: number; },
        @ConnectedSocket() socket: Socket
    ) {
        const roomName = `room-${data.roomId}`;
        socket.join(roomName);

        const user = this.users.find(user => user.id === socket.id);
        user.roomName = roomName;

        return { status: 'Ok!', roomId: data.roomId };
    }

    @SubscribeMessage('room_message')
    async handleMessage(
        @MessageBody() data: { message: string; },
        @ConnectedSocket() socket: Socket
    ) {
        const user = this.users.find(user => user.id === socket.id);
        socket.to(user.roomName).emit('message', data.message);
    }
}
