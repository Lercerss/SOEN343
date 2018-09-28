var express = require('express');
var db = require('../db/dbConnection');
var router = express.Router();
const User = require('../models/User');
const UserRegistry = require('../models/UserRegistry');
var cookies = require('cookie-parser');
var auth = require('../utils/Auth');
var createToken = auth.createToken;
var verifyToken = auth.verifyToken;

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

// add router.post('/getAllUsers') to get the users
router.post('/getUsers', (req, res) => {
    UserRegistry.getAllUsers((err, rows) => {
        if (err) {
            console.log(err);
        }
        res.send(rows);
    });
});

router.post('/validate', (req, res) => {
    // Validates jwt and sends user information
    // back to frontend
    const token = req.body.token;
    verifyToken(token, (err, decoded) => {
        if (err) {
            res.status(500).send({
                message: 'There was an error decrypting token'
            });
        }
        if (!decoded) {
            res.status(400).send({ message: 'Token has expired' });
        }
        res.status(200).send({
            username: decoded.data.username,
            isAdmin: decoded.data.isAdmin
        });
    });
});

module.exports = router;
