import { connection as db } from './dbConnection';

export class UserGateway {
    static saveUser(userRow, callback) {
        const query = db.format('INSERT INTO users VALUES (?)', [userRow]);
        db.query(query, (err, rows, fields) => {
            callback(err, rows);
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
            'SELECT client_id, username, firstName, lastName, isAdmin, timestamp FROM users',
            (err, rows, fields) => {
                callback(err, rows);
            }
        );
    }
}
