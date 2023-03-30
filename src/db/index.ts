import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default {
    init: () => open({
        filename: './database.sqlite',
        driver: sqlite3.Database
    })
};
