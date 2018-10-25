import { DatabaseManager } from './DatabaseManager';
import { connection as db } from './dbConnection';
import { User } from '../models/User';
import { UserRegistry } from '../models/UserRegistry';

export class UserGateway extends DatabaseManager {
	
	static saveUser(userJson, callback) {
		let user = new User(userJson);
		const query = db.format('INSERT INTO users VALUES (?)', [
                user.toDbRow()
            ]);
            db.query(query, (err, rows, fields) => {
                callback(err);
			});
        }
	

	static editUser() {}

	static findUser(username, callback) {
		const SQLQuery = db.format('SELECT * FROM users WHERE username=?', [username]);
			db.query(SQLQuery, (err, rows, fields) => {
            UserRegistry.jsonToUser(err, rows, fields, callback);
        });}

	static deleteUser() {}

	static getAll(callback) {
		db.query(
            'SELECT client_id, username, firstName, lastName, isAdmin, timestamp FROM users',
            (err, rows, fields) => {
                UserRegistry.jsonToUser(err, rows, fields, callback);
            }
        );
	}
}