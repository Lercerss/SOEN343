var express = require('express');
var app = express();

var sample = require('./routes/sample_route');

app.use('/', sample);

app.listen(3000, function () {
    console.log('Example app listening on port 3000');
});
