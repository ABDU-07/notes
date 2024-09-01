import pkg from "pg";
import getConfig from "../config/config.service.js";
const { Pool } = pkg;

export const pool = new Pool({
    database: getConfig("DATABASE_NAME"),
    user: getConfig("DATABASE_USER"),
    password: getConfig("DATABASE_PASSWORD"),
    host: getConfig("DATABASE_HOST"),
    port: parseInt(getConfig("DATABASE_PORT")),
});

export async function initDatabase() {
    await connectToDb();
    await setupModels();
}
async function connectToDb() {
    try {
        await pool.connect();
        console.log("Bazaga ulandi");
    } catch (err) {
        console.log("Bazaga ulanishda hatolik:", err.message);
    }
}

async function setupModels() {
    try {
        await pool.query(` 
        CREATE TABLE IF NOT EXISTS note_users (
            id SERIAL PRIMARY KEY,
            username VARCHAR UNIQUE NOT NULL,   
            email VARCHAR NOT NULL,
            password VARCHAR NOT NULL
        );
    `); 
        await pool.query(`
        CREATE TABLE IF NOT EXISTS notes (
            id SERIAL PRIMARY KEY,
            title VARCHAR NOT NULL,
            description TEXT NOT NULL,
            user_id INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES note_users(id) ON DELETE CASCADE
        );
    `);
        console.log("Jadvallarni yaratdi");
    } catch (err) {
        console.log("Jadvallarni yaratishda hatolik boldi", err);
    }
}
