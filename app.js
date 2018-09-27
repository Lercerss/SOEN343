var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var sample = require('./routes/router');

var corsOptions = {
    origin: 'http://localhost:8080'
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', sample);

app.listen(3000, function() {
    console.log('Example app listening on port 3000');
});
