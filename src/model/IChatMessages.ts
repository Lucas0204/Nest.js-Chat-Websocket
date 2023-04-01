import { Message } from "src/entities/Message";

export interface SaveMessageData {
    message: string;
    username: string;
    room_id: number;
}

export interface IChatMessages {
    saveMessage(data: SaveMessageData): Promise<void>;
    getRoomMessages(room_id: number): Promise<Message[]>;
}
