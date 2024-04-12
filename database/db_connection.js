import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config({
    path: '.env'
});

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.USER_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
}); 