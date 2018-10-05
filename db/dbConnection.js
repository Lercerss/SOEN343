import mysql from 'mysql';
import { config } from '../config';

var connection = mysql.createConnection(config.db);
connection.connect(function(err) {
    if (err) throw err;
});

export { connection };
