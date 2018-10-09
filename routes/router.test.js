import request from 'supertest';
import { app } from '../app';
import { connection as db } from '../db/dbConnection';
import { globalSetUp, emptyDB } from '../utils/testUtils';

let clientToken = '';
let adminToken = '';
beforeAll(done => {
    globalSetUp().then(tokenArray => {
        adminToken = tokenArray[0];
        clientToken = tokenArray[1];
        done();
    });
});

describe('Test the root path of backend', () => {
    test('It should response the GET method', done => {
        request(app)
            .get('/')
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body.message).toBe('Express server up and running');
                done();
            });
    });
});
describe('routes: login', () => {
    const validUser = {
        username: 'admintester',
        password: 'test'
    };
    const invalidUser = {
        username: 'DoesNotExist',
        password: 'password'
    };
    const invalidPass = {
        username: 'admintester',
        password: 'testl'
    };
    test('Valid login expects status 200', done => {
        request(app)
            .post('/login/')
            .send(validUser)
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toHaveProperty('token');
                done();
            });
    });
    test('Invalid login expects status 400', done => {
        request(app)
            .post('/login/')
            .send(invalidUser)
            .then(response => {
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('message');
                done();
            });
    });
    test('Incorrect password expects status 400', done => {
        request(app)
            .post('/login/')
            .send(invalidPass)
            .then(response => {
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('message');
                done();
            });
    });
});

describe('routes: create user', () => {
    const validUser = {
        username: 'newuser',
        password: 'newman',
        firstName: 'Paul',
        lastName: 'Newman',
        email: 'pnewman@gmail.com',
        address: '300 New Str.',
        phoneNumber: '514-412-2312',
        isAdmin: 0
    };
    test('Correct information expects status 200', done => {
        request(app)
            .post('/create-user/')
            .send({
                token: adminToken,
                userInfo: validUser
            })
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
    test('Correct information, but unauthorized expects status 403', done => {
        request(app)
            .post('/create-user/')
            .send({
                token: clientToken,
                userInfo: validUser
            })
            .then(response => {
                expect(response.statusCode).toBe(403);
                done();
            });
    });
});
describe('routes: validate token', () => {
    const fakeToken = 'fmdsklfsdjlfnadjkvsdfkjvdf2343212/..a';
    test('Valid token expects status 200', done => {
        request(app)
            .post('/validate/')
            .send({
                token: adminToken
            })
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body.isAdmin).toBe(1);
                expect(response.body.username).toBe('admintester');
                done();
            });
    });
    test('Invalid token sent', done => {
        request(app)
            .post('/create-user/')
            .send({
                token: fakeToken
            })
            .then(response => {
                expect(response.statusCode).toBe(500);
                done();
            });
    });
});
describe('routes: get user list', () => {
    test('Valid token expects status 200 and user list', done => {
        request(app)
            .post('/get-users/')
            .send({
                token: adminToken
            })
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body.length).toBeGreaterThanOrEqual(2);
                done();
            });
    });
    test.skip('Valid client token, forbidden request expects status 403', done => {
        request(app)
            .post('/get-users/')
            .send({
                token: clientToken
            })
            .then(response => {
                expect(response.statusCode).toBe(403);
                done();
            });
    });
});
afterAll(done => {
    db.query('DELETE FROM user', (err, rows, fields) => {
        if (err) {
            process.exit(1);
        }
        db.end(function(err) {
            if (err) {
                return console.log('error:' + err.message);
            }
            console.log('Closed the database connection.');
            done();
        });
    });
});
