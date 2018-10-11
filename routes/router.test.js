import request from 'supertest';
import { app } from '../app';
import { connection as db } from '../db/dbConnection';
import { globalSetUp } from '../utils/testUtils';
import { mediaData } from '../test/hardcoded';

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

describe('routes: retrieve catalog elements', () => {
    test.skip('It should respond with a complete array of catalog elements', (done) => {
        request(app)
            .get('/catalog-items/')
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toMatchObject(mediaData.initial);
                done();
            });
    });
});

describe('routes: addition of a media item', () => {
    let media = [];
    for (let i = 0; i < mediaData.addAndEdit.length; i++){
        let m = {};
        m['mediaInfo'] = mediaData.addAndEdit[i];
        m['token'] = adminToken;
        media.push(m);
    }

    for (let i = 0; i < media.length; i++){
        test.skip(`It should respond to adding a ${ media[i].mediaInfo.type } item with 200`, (done) => {
            request(app)
                .post('/add-item/')
                .send(media[i])
                .then((response) => {
                    expect(response.statusCode).toBe(200);
                    expect(response.body.isAdmin).toBe(1);
                    done();
                });
        });
    };

    let existingMedia = {};
    existingMedia['mediaInfo'] = mediaData.initial[0];
    existingMedia['token'] = adminToken;

    test.skip(`It should respond to adding already existing ${ mediaData.initial[0].type } item with 400`, (done) => {
        request(app)
            .post('/add-item/')
            .send(existingMedia)
            .then((response) => {
                expect(response.statusCode).toBe(400);
                expect(response.body.message).stringContaining('existing isbn');
                done();
            });
    });
});

describe('routes: editing of a media item in the catalog', () => {
    let media = [];

    for (let i = 0; i < mediaData.addAndEdit.length; i++){
        let m = {};
        m['mediaInfo'] = mediaData.addAndEdit[i];
        m['token'] = adminToken;
        media.push(m);
    }

    for (let i = 0; i < media.length; i++){
        test.skip(`It should respond to editing a ${ media[i].mediaInfo.type } item with 200`, (done) => {
            media[i].mediaInfo.title += 'o';
            request(app)
                .post('/edit-item/')
                .send(media[i])
                .then((response) => {
                    expect(response.statusCode).toBe(200);
                    expect(response.body.isAdmin).toBe(1);
                    media[i].mediaInfo.title.slice(0, -1);
                    done();
                });
        });
    };

    test.skip(`It should respond to editing an isbn of ${ media[0].mediaInfo.type } item with 400`, (done) => {
        media[0].mediaInfo.isbn10 = '1524796973';
        request(app)
            .post('/edit-item/')
            .send(media[0])
            .then((response) => {
                expect(response.statusCode).toBe(400);
                expect(response.body.message).stringContaining('cannot modify existing isbn');
                mediaData[0].mediaInfo.isbn10 = '1524796972';
                done();
            });
    });

    test.skip(`It should respond to editing an asin of ${ media[3].mediaInfo.type } item with 400`, (done) => {
        mediaData[3].mediaInfo.asin = 'B008FOB125';
        request(app)
            .post('/edit-item/')
            .send(media[3])
            .then((response) => {
                expect(response.statusCode).toBe(400);
                expect(response.body.message).stringContaining('cannot modify existing asin');
                mediaData[3].mediaInfo.asin = 'B008FOB124';
                done();
            });
    });
});

afterAll(done => {
    db.query('DELETE FROM users', (err, rows, fields) => {
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
