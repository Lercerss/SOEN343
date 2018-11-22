import bcrypt from 'bcrypt';
import moment from 'moment';
import { createToken } from '../utils/Auth';
import { catalogQueryBuilder, mediaMapper } from '../utils/hardcoded';
import { DatabaseManager } from '../db/DatabaseManager';

const db = DatabaseManager.getConnection();

export const usersTable = 'users';
export const mediaTables = {
    Book: 'books',
    Magazine: 'magazines',
    Music: 'music',
    Movie: 'movies'
};

export function globalSetUp() {
    return new Promise((resolve, reject) => {
        Object.keys(mediaTables).forEach(key => {
            db.query(`DELETE from ${mediaTables[key]}`, (err, rows, fields) => {
                if (err) {
                    console.log('Error while deleting foreign keys');
                    process.exit(1);
                    // throw err;
                }
            });
        });
        const deleteUsersQuery = db.format('DELETE FROM ??', usersTable);
        db.query(deleteUsersQuery, (err, rows, fields) => {
            if (err) {
                console.log(err);
                process.exit(1);
            }

            bcrypt.hash('test', 11, (err, res) => {
                if (err) {
                    console.log(err);
                }
                const values = [
                    [
                        1,
                        'admintester',
                        res,
                        'Test',
                        'McTest',
                        'testmctest@gmail.com',
                        '401 Test Av.',
                        '514-135-5869',
                        1,
                        moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                        0
                    ],
                    [
                        2,
                        'clienttester',
                        res,
                        'Test',
                        'McTest',
                        'testmctest@gmail.com',
                        '401 Test Av.',
                        '514-135-5869',
                        0,
                        moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                        0
                    ]
                ];

                const userQuery = db.format('INSERT INTO ?? VALUES ?', [usersTable, values]);
                db.query(userQuery, (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                });

                Object.keys(mediaTables).forEach(key => {
                    const values = catalogQueryBuilder(key);
                    const clearTable = db.format(
                        'DELETE FROM ??',
                        [mediaTables[key]]
                    );
                    const catalogQuery = db.format('INSERT INTO ?? VALUES ?', [
                        mediaTables[key],
                        values
                    ]);
                    db.query(clearTable, (err, rows, fields) => {
                        if (err) {
                            throw err;
                        }
                        db.query(catalogQuery, (err, rows, fields) => {
                            if (err) {
                                console.log(err);
                                throw err;
                            }
                        });
                    });
                });

                const infoArray = [
                    {
                        client_id: 1,
                        isAdmin: 1,
                        username: 'admintester'
                    },
                    {
                        client_id: 2,
                        isAdmin: 0,
                        username: 'clienttester'
                    }
                ];
                const tokenArray = infoArray.map(val => {
                    return createToken(val);
                });
                resolve(tokenArray);
            });
        });
    });
}
