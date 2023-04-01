import { Injectable, Logger } from '@nestjs/common';
import { IChatMessages, SaveMessageData } from './model/IChatMessages';
import { Message } from './entities/Message';

@Injectable()
export class ChatService {
	private readonly logger = new Logger(ChatService.name);

	constructor(private readonly chatMessages: IChatMessages) {}

	async saveMessage({ message, username, room_id }: SaveMessageData): Promise<void> {
		try {
			if (!message || !username || !+room_id) {
				throw new Error('Missing data to save message!');
			}

			await this.chatMessages.saveMessage({
				message,
				username,
				room_id
			});
		} catch (err) {
			this.logger.error(err);
			throw err;
		}
	}

	async getRoomMessages(room_id: number): Promise<Message[]> {
		try {
			const messages = await this.chatMessages.getRoomMessages(room_id);
			return messages;
		} catch (err) {
			this.logger.error(err);
			throw err;
		}
	}
}
