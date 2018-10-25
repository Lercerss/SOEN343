import { User } from './User';
import { connection as db } from '../db/dbConnection';
import { UserGateway } from '../db/UserGateway';


export class UserRegistry {
    static searchUser(username, callback) {
       UserGateway.findUser(username, callback);   
    }

    static getAllUsers() {
        return UserGateway.getAll();
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
        if (callback) {
            callback(err, userArray);}
    }

    static makeNewUser(userJson, callback) {
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
            UserGateway.saveUser(userJson, callback);
            });
        };
    }

