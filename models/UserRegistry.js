var bcrypt = require('bcrypt');
var db = require('../db/dbConnection');
const User = require('../models/User');

class UserRegistry {
    static searchUser(username, callback) {
        const SQLQuery = db.format('SELECT * FROM user WHERE username=?', [
            username
        ]);
        db.query(SQLQuery, (err, rows, fields) => {
            UserRegistry.jsonToUser(err, rows, fields, callback);
        });
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
}

module.exports = UserRegistry;
