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
        UserGateway.findUser(userJson.username, (error, users) => {
            if (error) {
                callback(error);
                return;
            }
            console.log(users);
            if (users.length !== 0) {
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
    static login(username, password, callback) {
        UserGateway.findUser(username, (err, rows) => {
            this.jsonToUser(err, rows, (err, userArray) => {
                if (err) {
                    return callback(err, null);
                }
                if (userArray.length === 0) {
                    let err = new Error('Username does not exist');
                    err.httpStatusCode = 400;
                    return callback(err, null);
                }

                let user = userArray[0];

                // Checking to see if account is logged in anywhere else
                if (user.loggedIn) {
                    let timeDelta = (Date.now() - user.timestamp) / (1000 * 60 * 60);

                    if (timeDelta < 1) {
                        let err = new Error('This account is logged in elsewhere');
                        err.httpStatusCode = 401;
                        return callback(err, null);
                    }
                }

                user.authenticate(password, valid => {
                    if (valid) {
                        UserGateway.login(user);
                        callback(null, user);
                    } else {
                        let err = new Error('Password is incorrect');
                        err.httpStatusCode = 400;
                        return callback(err, null);
                    }
                });
            });
        });
    }
    static logout(id, callback) {
        UserGateway.logout(id, (err, rows) => {
            if (err) {
                err.httpStatusCode = 500;
                return callback(err);
            }
            callback(null);
        });
    }
}
