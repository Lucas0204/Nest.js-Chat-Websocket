import Database from '../db';

export class ChatMessages {

    async saveMessage(data: { message: string; username: string; room_id: number; }) {
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
}
