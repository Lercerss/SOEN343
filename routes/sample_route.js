var express = require('express');
var router = express.Router();
var db = require('../db/dbConnection');

router.get('/', function (req, res) {
    db.query('SELECT * FROM test_table', (err, rows) => {
        if (err) {
            throw new Error(err);
        }
        res.send(rows);
    });
});

module.exports = router;
