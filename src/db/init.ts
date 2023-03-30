import Database from './index';

(async () => {
    const db = await Database.init();

    await db.exec(`
        CREATE TABLE messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            message TEXT,
            room_id INT,
            createdAt DATETIME
        )
    `);

    await db.close();
})();
