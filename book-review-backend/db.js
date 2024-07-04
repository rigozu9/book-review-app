import Database from 'better-sqlite3';
import dotenv from 'dotenv';

dotenv.config();

const db = new Database('book_review_app.db');

export default db;
