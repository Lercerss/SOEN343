import { connection as db } from './dbConnection';

export class DatabaseManager {
    static getconnection() {
        return db;
    }
}
