var con = require('../db/dbConnection');
var bcrypt = require('bcrypt');

class User {
    constructor (userJson) {
        this.client_id = userJson.client_id;
        this.username = userJson.username;
        this.password = userJson.password;
        this.firstName = userJson.firstName;
        this.lastName = userJson.lastName;
        this.email = userJson.email;
        this.address = userJson.address;
        this.phoneNumber = userJson.phoneNumber;
        this.isAdmin = userJson.isAdmin;
    }

    authenticate (password) {
        let hash = this.password;
        bcrypt.compare(password, hash, (err, res) => {
            if (err) {
                throw new Error('Could not compare pwd with hash');
            }
            return res;
        });
    }
}
