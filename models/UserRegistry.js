import { User } from './User';
import { UserGateway } from '../db/UserGateway';

export class UserRegistry {
    static searchUser(username, callback) {
        UserGateway.findUser(username, (err, rows) => {
            this.jsonToUser(err, rows, callback);
        });
    }

    static getAllUsers(callback) {
        UserGateway.getAll((error, rows) => {
            this.jsonToUser(error, rows, callback);
        });
    }

    static jsonToUser(err, jsonArray, callback) {
        if (err) {
            callback(err, []);
        }
        var userArray = [];
        for (var userJson of jsonArray) {
            var user = new User(userJson);
            userArray.push(user);
        }
        if (callback) {
            callback(err, userArray);
        }
    }

    static makeNewUser(userJson, callback) {
        this.searchUser(userJson.username, (error, users) => {
            if (error) {
                callback(error);
                return;
            }
            console.log(users);
            if (users && users.length) {
                error = new Error('User already exists');
                error.reason = 'username';
                callback(error);
                return;
            }
            let user = new User(userJson);
            if (!user.validate()) {
                callback(new Error('Invalid user information'));
                return;
            }
            user.hashPassword(err => {
                if (err) {
                    callback(err);
                    return;
                }
                UserGateway.saveUser(user.toDbRow(), callback);
            });
        });
    }
};
