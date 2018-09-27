var express = require('express');
var app = express();
var cors = require('cors');

var sample = require('./routes/router');

var corsOptions = {
    origin: 'localhost:8080',
};

app.use(cors(corsOptions));
app.use('/', sample);

app.listen(3000, function () {
    console.log('Example app listening on port 3000');
});
