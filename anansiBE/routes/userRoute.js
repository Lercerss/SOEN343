import { UserRegistry } from '../models/UserRegistry';
import { createToken } from '../utils/Auth';
import { validateToken } from './router';

export function loginUser(req, res, next) {
    let { username, password } = req.body;

    UserRegistry.login(username, password, (err, user) => {
        if (err) {
            return next(err);
        }

        res.status(200).json({
            isAdmin: user.isAdmin,
            username: user.username,
            token: createToken(user)
        });
    });
}

export function logoutUser(req, res, next) {
    validateToken(req.body.token, res, decoded => {
        UserRegistry.logout(decoded.data.client_id, err => {
            if (err) {
                return next(err);
            }
            res.status(200).send();
        });
    });
}

export function displayUsers(req, res) {
    validateToken(req.body.token, res, decoded => {
        if (!decoded.data.isAdmin) {
            res.status(403).send({
                message: 'Only administrator can view all users',
                isAdmin: decoded.data.isAdmin
            });
        } else {
            UserRegistry.getAllUsers((err, rows) => {
                if (err) {
                    console.log(err);
                }
                res.send(rows);
            });
        }
    });
}

export function validateUser(req, res) {
    // Validates jwt and sends user information
    // back to frontend
    validateToken(req.body.token, res, decoded => {
        res.status(200).send({
            username: decoded.data.username,
            isAdmin: decoded.data.isAdmin
        });
    });
}

export function createUser(req, res) {
    validateToken(req.body.token, res, decoded => {
        if (!decoded.data.isAdmin) {
            console.log(decoded);
            res.status(403).send({
                message: 'Only administrators can register new users'
            });
        } else {
            UserRegistry.makeNewUser(req.body.userInfo, err => {
                if (err) {
                    console.log(err);
                    if (err.reason === 'username') {
                        res.status(400).send({
                            message: 'Username already exists'
                        });
                    } else {
                        res.status(500).send({
                            message: 'Could not create user',
                            error: err
                        });
                    }
                    return;
                }
                res.status(200).send();
            });
        }
    });
}

export function displayUserProfile(req, res){
    validateToken(req.get('Authorization').split(' ')[1], res, decoded => {
        UserRegistry.getUser(req.params.username, (err, users) => {
            if (err || users.length !== 1){
                res.status(500).send({
                    message: 'There was an error obtaining a specific user',
                    error: err,
                });
                return;
            }
            res.status(200).send({
                user: users[0]
            });
        });
    });
}
