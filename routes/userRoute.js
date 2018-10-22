import { UserRegistry } from '../models/UserRegistry';
import { createToken } from '../utils/Auth';
import { validateToken } from './router';

export function loginUser(req, res) {
    let { username, password } = req.body;

    UserRegistry.searchUser(username, (err, userArray) => {
        if (err) {
            res.status(500).send({
                message: 'There was an error querying the database'
            });
            return;
        }
        if (userArray.length === 0) {
            res.status(400).send({
                message: 'Username does not exist'
            });
            return;
        }

        let user = userArray[0];

        user.authenticate(password, valid => {
            if (valid) {
                user.login();
                res.status(200).json({
                    isAdmin: user.isAdmin,
                    username: user.username,
                    token: createToken(user)
                });
            } else {
                res.status(400).send({
                    message: 'Password is incorrect.'
                });
            }
        });
    });
};

export function displayUsers(req, res) {
    // TODO: Validate Token
    UserRegistry.getAllUsers((err, rows) => {
        if (err) {
            console.log(err);
        }
        res.send(rows);
    });
};

export function validateUser(req, res) {
    // Validates jwt and sends user information
    // back to frontend
    const token = req.body.token;
    validateToken(token, res, decoded => {
        res.status(200).send({
            username: decoded.data.username,
            isAdmin: decoded.data.isAdmin
        });
    });
};

export function createUser(req, res) {
    validateToken(req.body.token, res, decoded => {
        if (!decoded.data.isAdmin) {
            console.log(decoded);
            res.status(403).send({
                message: 'Only administrators can register new users'
            });
        } else {
            UserRegistry.searchUser(req.body.userInfo.username, (err, userArray) => {
                if (err) {
                    res.status(500).send({
                        message: 'There was an error checking for username existence'
                    });
                    return;
                }
                if (userArray.length !== 0) {
                    res.status(400).send({
                        message: 'Username already exists'
                    });
                    return;
                }
                UserRegistry.makeNewUser(req.body.userInfo, err => {
                    if (err) {
                        console.log(err);
                        res.status(400).send({
                            message: 'Could not create user',
                            error: err
                        });
                    }
                    res.status(200).send();
                });
            });
        }
    });
};
