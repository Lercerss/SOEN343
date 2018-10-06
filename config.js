import dotenv from 'dotenv';

try {
    dotenv.config();
} catch (ex) {}

export const config = {
    db: {
        host: '127.0.0.1', // localhost
        user: 'dbuser',
        password: process.env.MYSQL_PASSWORD,
        database: 'anansi_db'
    }
};
