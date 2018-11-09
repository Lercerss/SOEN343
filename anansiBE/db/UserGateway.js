import { DatabaseManager } from '../db/DatabaseManager';

const db = DatabaseManager.getConnection();

export class UserGateway {
    static saveUser(userRow, callback) {
        const query = db.format('INSERT INTO users VALUES (?)', [userRow]);
        db.query(query, (err, rows, fields) => {
            callback(err, rows);
        });
    }
    static login(user, callback) {
        const SQLQuery = db.format(
            'UPDATE users SET timestamp = CURRENT_TIMESTAMP, loggedIn = 1 WHERE username = ?',
            [user.username]
        );

        db.query(SQLQuery, (err, rows, fields) => {
            callback(err);
        });
    }
    static logout(id, callback) {
        const SQLQuery = db.format('UPDATE users SET loggedIn = 0 WHERE client_id = ?', [id]);
        db.query(SQLQuery, (err, rows, fields) => {
            callback(err);
        });
    }

    static editUser() {
        // Temporarily left blank
    }

    static findUser(username, callback) {
        const SQLQuery = db.format('SELECT * FROM users WHERE username=?', [username]);
        db.query(SQLQuery, (err, rows, fields) => {
            callback(err, rows);
        });
    }

    static deleteUser() {
        // Temporarily left blank
    }

    static getAll(callback) {
        db.query(
            'SELECT client_id, username, firstName, lastName, email, address, phoneNumber, isAdmin, timestamp, loggedIn FROM users',
            (err, rows, fields) => {
                callback(err, rows);
            }
        );
    }
}
