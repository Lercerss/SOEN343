import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { router } from './routes/router';
import morgan from 'morgan';
var app = express();

var corsOptions = {
    origin: 'http://localhost:8080'
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/', router);

app.listen(3000, function() {
    console.log('Example app listening on port 3000');
});
