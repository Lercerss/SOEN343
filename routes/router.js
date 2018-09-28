var express = require('express');
var db = require('../db/dbConnection');
var router = express.Router();
const User = require('../models/User');
const UserRegistry = require('../models/UserRegistry');
var cookies = require('cookie-parser');
var auth = require('../utils/Auth');
var createToken = auth.createToken;

router.post('/login', (req, res) => {
    let {
        username,
        password
    } = req.body;

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

var verifyToken = (token, res, callback) => {
    auth.verifyToken(token, (err, decoded) => {
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
    verifyToken(token, res, (decoded) => {
        res.status(200).send({
            username: decoded.data.username,
            isAdmin: decoded.data.isAdmin
        });
    });
});

router.post('/create-user', (req, res) => {
    console.log(req.body);
    verifyToken(req.body.token, res, (decoded) => {
        if (!decoded.data.isAdmin) {
            console.log(decoded);
            res.status(403).send({
                message: 'Only administrators can register new users'
            });
        } else {
            UserRegistry.searchUser(req.body.username, (err, userArray) => {
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
                UserRegistry.makeNewUser(req.body, (err) => {
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

module.exports = router;
