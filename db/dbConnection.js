var Client = require('mariasql');
var config = require('../config');

var connection = new Client(config.db);

connection.connect(function (err) {
    if (err) throw err;
});

module.exports = connection;
