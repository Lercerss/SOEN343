import NodeEnvironment from 'jest-environment-node';
import bcrypt from 'bcrypt';
import { connection as db } from '../db/dbConnection';
import moment from 'moment';
import { createToken } from '../utils/Auth';

export function globalSetUp() {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM user', (err, rows, fields) => {
            if (err) {
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
                        moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
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
                        moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
                    ]
                ];

                const query = db.format('INSERT INTO user VALUES ?', [values]);
                console.log(query);
                db.query(query, (err, rows, fields) => {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
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
