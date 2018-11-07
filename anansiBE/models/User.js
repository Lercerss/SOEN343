import bcrypt from 'bcrypt';

export class User {
    constructor(userJson) {
        this.client_id = Number(userJson.client_id);
        this.username = userJson.username;
        this.password = userJson.password;
        this.firstName = userJson.firstName;
        this.lastName = userJson.lastName;
        this.email = userJson.email;
        this.address = userJson.address;
        this.phoneNumber = userJson.phoneNumber;
        this.isAdmin = Boolean(userJson.isAdmin);
        this.timestamp = userJson.timestamp;
        this.loggedIn = userJson.loggedIn || 0;
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

    validate() {
        return (
            this.username.length >= 4 &&
            this.password.length >= 4 &&
            this.firstName.match(/^(?! )(\w+-?\s?)+(?<! )$/) &&
            this.lastName.match(/^(?! )(\w+-?\s?)+(?<! )$/) &&
            this.email.match(/.+@.+\..+/) &&
            this.phoneNumber.match(/^(\+?\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/) &&
            this.username.match(/^\S*$/)
        );
    }

    hashPassword(callback) {
        bcrypt.hash(this.password, 11, (err, res) => {
            if (err) {
                callback(err);
            }
            this.password = res;
            callback();
        });
    }

    toDbRow() {
        return [
            this.client_id || undefined,
            this.username,
            this.password,
            this.firstName,
            this.lastName,
            this.email,
            this.address,
            this.phoneNumber,
            this.isAdmin,
            this.timestamp,
            this.loggedIn || 0
        ];
    }
}
