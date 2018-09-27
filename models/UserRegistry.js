var con = require('../db/dbConnection');
var bcrypt = require('bcrypt');
var db = require('../db/dbConnection');
const User = require('../models/User');

class UserRegistry {
    static searchUser (username, callback){
        var prep = db.prepare('SELECT * FROM user WHERE username = :username');
        db.query(prep({ username: username }), callback);
    }
}

module.exports = UserRegistry;
