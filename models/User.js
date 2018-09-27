var db = require('../db/dbConnection');
var bcrypt = require('bcrypt');

class User {
    constructor(userJson) {
        this.client_id = userJson.client_id;
        this.username = userJson.username;
        this.password = userJson.password;
        this.firstName = userJson.firstName;
        this.lastName = userJson.lastName;
        this.email = userJson.email;
        this.address = userJson.address;
        this.phoneNumber = userJson.phoneNumber;
        this.isAdmin = userJson.isAdmin;
        this.timestamp = userJson.isAdmin;
    }

    authenticate(password, callback) {
        let hash = this.password;
        bcrypt.compare(password, hash, (err, res) => {
            if (err) {
                throw new Error('Could not compare pwd with hash');
            }
            callback(res);
        });
    }

    login() {
        const SQLQuery = db.format(
            'UPDATE user SET timestamp = ? WHERE username = ?',
            [this.timestamp, this.username]
        );

        db.query(SQLQuery);
    }
}

module.exports = User;
