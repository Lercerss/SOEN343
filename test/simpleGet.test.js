import request from 'supertest';
import { app } from '../app';
import { connection } from '../db/dbConnection';

describe('Test the root path of backend', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/').then((response) => {
            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Express server up and running');
            done();
        });
    });
});

afterAll((done) => {
    connection.end(function(err) {
        if (err) {
            return console.log('error:' + err.message);
        }
        console.log('Closed the database connection.');
    });
    done();
});
