import { User } from './User';
import { connection as db } from '../db/dbConnection';

export class UserRegistry {
    static searchUser(username, callback) {
        const SQLQuery = db.format('SELECT * FROM user WHERE username=?', [
            username
        ]);
        db.query(SQLQuery, (err, rows, fields) => {
            UserRegistry.jsonToUser(err, rows, fields, callback);
        });
    }
    static getAllUsers(callback) {
        db.query(
            'SELECT client_id, username, firstName, lastName, isAdmin, timestamp FROM user',
            (err, rows, fields) => {
                UserRegistry.jsonToUser(err, rows, fields, callback);
            }
        );
    }
    static jsonToUser(err, jsonArray, fields, callback) {
        if (err) {
            callback(err, []);
        }
        var userArray = [];
        for (var userJson of jsonArray) {
            var user = new User(userJson);
            userArray.push(user);
        }
        callback(err, userArray);
    }

    static makeNewUser(userJson, callback) {
        let user = new User(userJson);
        if (!user.validate()) {
            callback(new Error('Invalid user information'));
        }
        user.hashPassword(err => {
            if (err) {
                callback(err);
            }
            const query = db.format('INSERT INTO user VALUES (?)', [
                user.toDbRow()
            ]);
            db.query(query, (err, rows, fields) => {
                callback(err);
            });
        });
    }
}
