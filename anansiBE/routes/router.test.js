import request from 'supertest';
import { app } from '../app';
import { globalSetUp, usersTable, mediaTables } from '../utils/testUtils';
import { mediaData } from '../utils/hardcoded';
import { DatabaseManager } from '../db/DatabaseManager';

const db = DatabaseManager.getConnection();

var clientToken = '';
var adminToken = '';

function buildCatalogRequest(arr, token) {
    let builtArr = [];

    for (let i = 0; i < arr.length; i++) {
        let m = {};
        m['type'] = arr[i].mediaType;
        m['itemInfo'] = arr[i];
        m['token'] = token;
        builtArr.push(m);
    }
    return builtArr;
}

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
            .post('/user/login/')
            .send(validUser)
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toHaveProperty('token');
                done();
            });
    });
    test('Invalid login expects status 400', done => {
        request(app)
            .post('/user/login/')
            .send(invalidUser)
            .then(response => {
                expect(response.statusCode).toBe(400);
                expect(response.body).toHaveProperty('message');
                done();
            });
    });
    test('Incorrect password expects status 400', done => {
        request(app)
            .post('/user/login/')
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
            .post('/user/create/')
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
            .post('/user/create/')
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
            .post('/user/validate/')
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
            .post('/user/create/')
            .send({
                token: fakeToken
            })
            .then(response => {
                expect(response.statusCode).toBe(401);
                done();
            });
    });
});

describe('routes: get user list', () => {
    test('Valid token expects status 200 and user list', done => {
        request(app)
            .post('/user/display-all/')
            .send({
                token: adminToken
            })
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body.length).toBeGreaterThanOrEqual(2);
                done();
            });
    });
    test('Valid client token, forbidden request expects status 403', done => {
        request(app)
            .post('/user/display-all/')
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
    test('It should respond with a complete array of catalog elements', done => {
        var tokens = [adminToken, clientToken];
        tokens.forEach(token => {
            request(app)
                .post('/item/display/')
                .send({
                    token: token,
                    filters: {},
                    sorting: {}
                })
                .then(response => {
                    expect(response.statusCode).toBe(200);
                    expect(response.body[0].itemInfo.title).toBe(mediaData.initial[0].title);
                    done();
                });
        });
    });
});

describe('routes: addition of a media item', () => {
    test(`It should respond to adding an item with 200`, done => {
        let media = buildCatalogRequest(mediaData.addAndEdit, adminToken);
        for (let i = 0; i < media.length; i++) {
            request(app)
                .post('/item/add/')
                .send(media[i])
                .then(response => {
                    expect(response.statusCode).toBe(200);
                    done();
                });
        }
    });

    test(`It should respond to adding already existing ${
        mediaData.initial[0].mediaType
    } item with 400`, done => {
        let existingMedia = buildCatalogRequest(mediaData.initial, adminToken);
        request(app)
            .post('/item/add/')
            .send(existingMedia[0])
            .then(response => {
                expect(response.statusCode).toBe(400);
                done();
            });
    });
});

describe('routes: editing and deleting of a media item in the catalog', () => {
    test(`It should respond to editing an item with 200`, done => {
        let media = buildCatalogRequest(mediaData.initial, adminToken);
        for (let i = 0; i < media.length; i++) {
            media[i]['itemInfo']['id'] = 1;
            media[i].itemInfo.title += 'o';
            request(app)
                .post('/item/edit/')
                .send(media[i])
                .then(response => {
                    expect(response.statusCode).toBe(200);
                    media[i].itemInfo.title.slice(0, -1);
                    done();
                });
        }
    });

    test(`It should respond to deleting of an existing ${
        mediaData.initial[0].mediaType
    } item with 200`, done => {
        let media = buildCatalogRequest(mediaData.initial, adminToken);
        media[0]['itemInfo']['id'] = 1;
        request(app)
            .del('/item/delete/')
            .send(media[0])
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body.message).toEqual('Item was deleted');
                done();
            });
    });
});

afterAll(done => {
    const deleteUsersItemsQuery = db.format('DELETE FROM ??', usersTable);
    db.query(deleteUsersItemsQuery, (err, rows, fields) => {
        if (err) {
            console.log('Error while wiping out users test db');
            process.exit(1);
        }

        Object.keys(mediaTables).forEach(key => {
            const deleteCatalogItemsQuery = db.format('DELETE FROM ??', mediaTables[key]);
            db.query(deleteCatalogItemsQuery, (err, rows, fields) => {
                if (err) {
                    console.log('Error while wiping out catalog test dbs');
                    process.exit(1);
                }
            });
        });

        db.end(function(err) {
            if (err) {
                return console.log('error:' + err.message);
            }

            console.log('Closed the database connection.');
            done();
        });
    });
});
