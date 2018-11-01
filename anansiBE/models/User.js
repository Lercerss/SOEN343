import bcrypt from 'bcrypt';
import moment from 'moment';
import { DatabaseManager } from '../db/DatabaseManager';

const db = DatabaseManager.getConnection();

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
    }

    setTimestamp(date) {
        this.timestamp = moment(date).format('YYYY-MM-DD HH:mm:ss');
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
        this.setTimestamp(Date.now());
        const SQLQuery = db.format(
            'UPDATE users SET timestamp = ? WHERE username = ?',
            [this.timestamp, this.username]
        );

        db.query(SQLQuery);
    }

    validate() {
        return (
            this.username.length > 4 &&
            this.password.length > 4 &&
            this.firstName.match(/^(\w+-?\s?)+$/) &&
            this.lastName.match(/^(\w+-?\s?)+$/) &&
            this.email.match(/.+@.+\..+/) &&
            this.phoneNumber.match(/^(\+?\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/)
        );
    }

    hashPassword(callback) {
        bcrypt.hash(this.password, 11, (err, res) => {
            if (err) {
                callback(err);
            }
            this.password = res;
            this.setTimestamp(Date.now());
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
            this.timestamp
        ];
    }
}
