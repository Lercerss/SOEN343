import request from 'supertest';
import { app } from '../app';
import { globalSetUp, usersTable, mediaTables } from '../utils/testUtils';
import { mediaData } from '../utils/hardcoded';
import { DatabaseManager } from '../db/DatabaseManager';

const db = DatabaseManager.getConnection();

var clientToken = '';
var adminToken = '';

const user = {
    username: 'newuser',
    password: 'newman',
    firstName: 'Paul',
    lastName: 'Newman',
    email: 'pnewman@gmail.com',
    address: '300 New Str.',
    phoneNumber: '514-412-2312',
    isAdmin: 0
};

function buildCatalogRequest(arr) {
    let builtArr = [];
    let mediaCount = [1, 1, 1, 1];
    arr.forEach(el => {
        let m = {};
        let type = el.mediaType;
        m['type'] = type;
        m['itemInfo'] = el;
        builtArr.push(m);

        if (type === 'Book') {
            m['itemInfo']['id'] = mediaCount[0];
            mediaCount[0]++;
        } else if (type === 'Magazine') {
            m['itemInfo']['id'] = mediaCount[1];
            mediaCount[1]++;
        } else if (type === 'Music') {
            m['itemInfo']['id'] = mediaCount[2];
            mediaCount[2]++;
        } else if (type === 'Movie') {
            m['itemInfo']['id'] = mediaCount[3];
            mediaCount[3]++;
        }
    });
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
    test('Invalid login expects status 401', done => {
        request(app)
            .post('/user/login/')
            .send(invalidUser)
            .then(response => {
                expect(response.statusCode).toBe(401);
                expect(response.body).toHaveProperty('message');
                done();
            });
    });
    test('Incorrect password expects status 401', done => {
        request(app)
            .post('/user/login/')
            .send(invalidPass)
            .then(response => {
                expect(response.statusCode).toBe(401);
                expect(response.body).toHaveProperty('message');
                done();
            });
    });
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
});

describe('routes: create user', () => {
    const validUser = user;
    test('Correct information expects status 200', done => {
        request(app)
            .post('/user/create/')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(validUser)
            .then(response => {
                expect(response.statusCode).toBe(200);
                done();
            });
    });
    test('Correct information, but unauthorized expects status 403', done => {
        request(app)
            .post('/user/create/')
            .set('Authorization', `Bearer ${clientToken}`)
            .send(validUser)
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
            .get('/user/validate/')
            .set('Authorization', `Bearer ${adminToken}`)
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body.isAdmin).toBe(1);
                expect(response.body.username).toBe('admintester');
                done();
            });
    });
    test('Invalid token expects status 401', done => {
        request(app)
            .get('/user/validate/')
            .set('Authorization', `Bearer ${fakeToken}`)
            .then(response => {
                expect(response.statusCode).toBe(401);
                done();
            });
    });
});

describe('routes: get user list', () => {
    test('Valid token expects status 200 and user list', done => {
        request(app)
            .get('/user/display-all/')
            .set('Authorization', `Bearer ${adminToken}`)
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body.length).toBeGreaterThanOrEqual(2);
                done();
            });
    });
    test('Valid client token, forbidden request expects status 403', done => {
        request(app)
            .get('/user/display-all/')
            .set('Authorization', `Bearer ${clientToken}`)
            .then(response => {
                expect(response.statusCode).toBe(403);
                done();
            });
    });
});

describe('routes: obtaining a user profile', () => {
    const validUser = user;
    test('It should respond with user details for the user requested with valid token', done => {
        request(app)
            .get(`/user/profile/${validUser.username}`)
            .set('Authorization', `Bearer ${clientToken}`)
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body.user.username).toBe(validUser.username);
                done();
            });
    });
    test('It should respond with 401 for the user requested with invalid token', done => {
        request(app)
            .get(`/user/profile/${validUser.username}`)
            .set('Authorization', `Bearer ${clientToken}error`)
            .then(response => {
                expect(response.statusCode).toBe(401);
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
                .set('Authorization', `Bearer ${token}`)
                .send({
                    filters: {
                        mediaType: null,
                        fields: {}
                    },
                    ordering: {
                        title: 'DESC',
                    },
                    nPage: 1
                })
                .then(response => {
                    expect(response.statusCode).toBe(200);
                    expect(response.body.catalog[0].itemInfo.title).toBe(
                        mediaData.initial[2].title
                    );
                    done();
                });
        });
    });
    test('It should respond with an array of catalog elements according to filters', done => {
        var tokens = [adminToken, clientToken];
        tokens.forEach(token => {
            request(app)
                .post('/item/display/')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    filters: {
                        mediaType: 'Magazine',
                        fields: {
                            title: 'tim'
                        }
                    },
                    ordering: {},
                    nPage: 1
                })
                .then(response => {
                    expect(response.statusCode).toBe(200);
                    expect(response.body.size).toBe(1);
                    expect(response.body.catalog[0].itemInfo.title).toBe(
                        mediaData.initial[1].title
                    );
                    done();
                });
        });
    });
    test('It should respond with an array of catalog elements according to ordering', done => {
        var tokens = [adminToken, clientToken];
        tokens.forEach(token => {
            request(app)
                .post('/item/display/')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    filters: {
                        mediaType: null,
                        fields: {},
                    },
                    ordering: {
                        title: 'ASC',
                    },
                    nPage: 1
                })
                .then(response => {
                    expect(response.statusCode).toBe(200);
                    expect(response.body.size).toBe(5);
                    expect(response.body.catalog[0].itemInfo.title).toBe(
                        mediaData.initial[3].title
                    );
                    done();
                });
        });
    });
    test('It should respond with an array of catalog elements according to filters and ordering', done => {
        var tokens = [adminToken, clientToken];
        tokens.forEach(token => {
            request(app)
                .post('/item/display/')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    filters: {
                        mediaType: 'Book',
                        fields: {
                            format: 'Paperback'
                        }
                    },
                    ordering: {
                        author: 'ASC'
                    },
                    nPage: 1
                })
                .then(response => {
                    expect(response.statusCode).toBe(200);
                    expect(response.body.size).toBe(2);
                    expect(response.body.catalog[0].itemInfo.title).toBe(
                        mediaData.initial[4].title
                    );
                    expect(response.body.catalog[1].itemInfo.title).toBe(
                        mediaData.initial[0].title
                    );
                    done();
                });
        });
    });
});

describe('routes: addition of a media item', () => {
    test(`It should respond to adding an item with 200`, done => {
        let media = buildCatalogRequest(mediaData.addAndEdit);
        media.forEach(el => {
            request(app)
                .post('/item/add/')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(el)
                .then(response => {
                    console.log(response.body);
                    expect(response.statusCode).toBe(200);
                    expect(response.body.copies.map(copy => copy.name)).toEqual(el.itemInfo.copies.map(copy => copy.name));
                    expect(response.body.copies.map(copy => copy.id).filter(id => id < 0)).toEqual([]);
                    done();
                });
        });
    });

    test(`It should respond to adding already existing ${
        mediaData.initial[0].mediaType
    } item with 400`, done => {
        let existingMedia = buildCatalogRequest(mediaData.initial);
        request(app)
            .post('/item/add/')
            .set('Authorization', `Bearer ${adminToken}`)
            .send(existingMedia[0])
            .then(response => {
                expect(response.statusCode).toBe(400);
                done();
            });
    });
});

describe('routes: editing and deleting of a media item in the catalog', () => {
    test(`It should respond to editing an item with 200`, done => {
        let media = buildCatalogRequest(mediaData.initial);
        media.forEach(el => {
            el.itemInfo.title += 'o';
            request(app)
                .post('/item/get-lock/')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    id: el.itemInfo.id,
                    type: el.type
                })
                .then(response => {
                    expect(response.statusCode).toBe(200);
                    request(app)
                        .post('/item/edit/')
                        .set('Authorization', `Bearer ${adminToken}`)
                        .send(el)
                        .then(response => {
                            expect(response.statusCode).toBe(200);
                            el.itemInfo.title.slice(0, -1);
                            done();
                        });
                    done();
                });
        });
    });

    test(`It should respond to getting and releasing a lock with 200`, done => {
        let media = buildCatalogRequest(mediaData.initial);
        media.forEach(el => {
            el.itemInfo.title += 'o';
            request(app)
                .post('/item/get-lock/')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    id: el.itemInfo.id,
                    type: el.type,
                })
                .then(response => {
                    expect(response.statusCode).toBe(200);
                    request(app)
                        .post('/item/release-lock/')
                        .set('Authorization', `Bearer ${adminToken}`)
                        .send({
                            id: el.itemInfo.id,
                            type: el.type,
                        })
                        .then(response => {
                            expect(response.statusCode).toBe(200);
                            el.itemInfo.title.slice(0, -1);
                            done();
                        });
                });
        });
    });

    test(`It should respond to deleting of an existing ${
        mediaData.initial[0].mediaType
    } item with 200`, done => {
        let media = buildCatalogRequest(mediaData.initial);
        media.forEach(el => {
            request(app)
                .del('/item/delete/')
                .set('Authorization', `Bearer ${adminToken}`)
                .send(el)
                .then(response => {
                    expect(response.statusCode).toBe(200);
                    expect(response.body.message).toEqual('Item was deleted');
                    done();
                });
        });
    });
});

afterAll(done => {
    var delPromises = [];
    Object.keys(mediaTables).forEach(key => {
        let delProm = new Promise((resolve, reject) => {
            db.query(`DELETE from ${mediaTables[key]}`, (err, rows, fields) => {
                if (err) {
                    console.log('Error while deleting foreign keys');
                    process.exit(1);
                }
                resolve();
            });
        });
        delPromises.push(delProm);
    });
    return Promise.all(delPromises)
        .then(values => {
            const deleteUsersItemsQuery = db.format('DELETE FROM ??', usersTable);
            db.query(deleteUsersItemsQuery, (err, rows, fields) => {
                if (err) {
                    console.log('Error while wiping out users test db');
                    process.exit(1);
                }
                db.end(function (err) {
                    if (err) {
                        return console.log('error:' + err.message);
                    }
                    console.log('Closed the database connection.');
                    done();
                });
            });
        });
});
