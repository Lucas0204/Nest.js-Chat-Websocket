import { Injectable } from '@nestjs/common';
import Database from '../db';
import { IChatMessages, SaveMessageData } from './IChatMessages';
import { Message } from 'src/entities/Message';

@Injectable()
export class ChatMessages implements IChatMessages {
    async saveMessage(data: SaveMessageData) {
        const db = await Database.init();
        const { message, username, room_id } = data;

        await db.run(`
            INSERT INTO messages (
                username,
                message,
                room_id,
                createdAt
            ) VALUES (
                "${username}",
                "${message}",
                ${room_id},
                ${Date.now()}
            )
        `);

        await db.close();
    }

    async getRoomMessages(room_id: number): Promise<Message[]> {
        const db = await Database.init();

        const messages = await db.all(`
            SELECT *
            FROM messages
            WHERE room_id = ${room_id}
        `) as Message[];

        await db.close();

        return messages;
    }
}
