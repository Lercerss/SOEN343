var express = require('express');
var db = require('../db/dbConnection');
var router = express.Router();
const User = require('../models/User');
const UserRegistry = require('../models/UserRegistry');

var auth = require('../utils/Auth');
var createToken = auth.createToken;

router.get('/', function(req, res) {
    db.query('SELECT * FROM test_table', (err, rows) => {
        if (err) {
            throw new Error(err);
        }
        res.send(rows);
    });
});

router.post('/login', (req, res) => {
    let { username, password } = req.body;

    UserRegistry.searchUser(username, (err, rows, fields) => {
        if (err) {
            res.status(500).send({
                message: 'There was an error querying the database'
            });
            return;
        }
        if (rows.length === 0) {
            res.status(400).send({
                message: 'Username does not exist'
            });
            return;
        }

        let user = new User(rows[0]);

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

module.exports = router;
