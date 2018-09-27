var con = require('../db/dbConnection');
var bcrypt = require('bcrypt');
var db = require('../db/dbConnection');
const User = require('../models/User');

class UserRegistry {
    static searchUser(username, callback) {
        const SQLQuery = db.format('SELECT * FROM user WHERE username=?', [
            username
        ]);
        db.query(SQLQuery, callback);
    }
}

module.exports = UserRegistry;
