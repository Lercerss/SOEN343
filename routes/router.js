import express from 'express';
import { UserRegistry } from '../models/UserRegistry';
import { createToken, verifyToken } from '../utils/Auth';
import { Catalog } from '../models/Catalog';

var router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send({
        message: 'Express server up and running'
    });
});

router.post('/login', (req, res) => {
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
});

router.post('/get-users', (req, res) => {
// TODO: Validate Token
    UserRegistry.getAllUsers((err, rows) => {
        if (err) {
            console.log(err);
        }
        res.send(rows);
    });
});

const validateToken = (token, res, callback) => {
    verifyToken(token, (err, decoded) => {
        if (err) {
            console.log(err);
            res.status(500).send({
                message: 'There was an error decrypting token'
            });
        } else if (!decoded) {
            res.status(400).send({
                message: 'Token has expired'
            });
        } else {
            callback(decoded);
        }
    });
};

router.post('/validate', (req, res) => {
    // Validates jwt and sends user information
    // back to frontend
    const token = req.body.token;
    validateToken(token, res, decoded => {
        res.status(200).send({
            username: decoded.data.username,
            isAdmin: decoded.data.isAdmin
        });
    });
});

router.post('/create-user', (req, res) => {
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
});

router.post('/add-item', (req, res) => {
    validateToken(req.body.token, res, decoded => {
        if (!decoded.data.isAdmin) {
            console.log(decoded);
            res.status(403).send({
                message: 'Only administrators can add media items'
            });
        } else {
            Catalog.searchItem(req.body.type, req.body.itemInfo, (err, item, index) => {
                if (err) {
                    res.status(500).send({
                        message: 'There was an error checking for item existence'
                    });
                    return;
                }
                if (item !== null) {
                    res.status(400).send({
                        message: 'Item already exists'
                    });
                    return;
                }
                Catalog.addItem(req.body.type, req.body.itemInfo, err => {
                    if (err) {
                        console.log(err);
                        res.status(400).send({
                            message: 'Could not add item',
                            error: err
                        });
                    }
                    res.status(200).send();
                });
            });
        }
    });
});

router.post('/edit-item', (req, res) => {
    validateToken(req.body.token, res, decoded => {
        if (!decoded.data.isAdmin) {
            console.log(decoded);
            res.status(403).send({
                message: 'Only administrators can add media items'
            });
        } else {
            Catalog.searchItem(req.body.type, req.body.itemInfo, (err, item, index) => {
                if (err) {
                    res.status(500).send({
                        message: 'There was an error checking for item existence'
                    });
                    return;
                }
                if (item == null) {
                    res.status(400).send({
                        message: 'Item does not exist'
                    });
                    return;
                }
                Catalog.editItem(req.body.type, req.body.itemInfo, index, err => {
                    if (err) {
                        console.log(err);
                        res.status(400).send({
                            message: 'Could not edit item',
                            error: err
                        });
                    }
                    res.status(200).send();
                });
            });
        }
    });
});

export { router };
