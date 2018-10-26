import mysql from 'mysql';
import { config } from '../config';

const connection = mysql.createConnection(config.db);
connection.connect(function(err) {
    if (err) throw err;
});

export class DatabaseManager {
    static getConnection() {
        return connection;
    }
}
