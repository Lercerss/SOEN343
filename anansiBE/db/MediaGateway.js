import { DatabaseManager } from './DatabaseManager';
import moment from 'moment';
import knex from 'knex';

const db = DatabaseManager.getConnection();

export class MediaGateway {
    static _upsertCopies(copiesTable, copies, copiesFK, itemId, callback) {
        const copiesQuery = db.format(
            `INSERT INTO ?? VALUES ? 
            ON DUPLICATE KEY UPDATE 
                id=VALUES(id),
                name=VALUES(name);`,
            [
                copiesTable,
                copies && copies.map(copy => [(copy.id >= 0 ? copy.id : null), itemId, copy.name]),
            ]
        );
        db.query(copiesQuery, err => {
            if (err) {
                callback(err);
                return;
            }
            db.query(`SELECT id, name FROM ${copiesTable} WHERE ${copiesFK}=${itemId}`, (err, rows) => {
                callback(err, rows);
            });
        });
    }

    static saveMedia(type, fields, callback) {
        var query, copiesTable, copiesFK;
        if (type === 'Book') {
            query = db.format('INSERT INTO books(title, author, format, pages, publisher, publicationDate, language, isbn10, isbn13) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [fields['title'], fields['author'], fields['format'], fields['pages'], fields['publisher'], moment(fields['publicationDate']).format('YYYY-MM-DD HH:mm:ss'),
                    fields['language'], fields['isbn10'], fields['isbn13']]);
            copiesTable = 'book_copies';
            copiesFK = 'book_id';
        } else if (type === 'Magazine') {
            query = db.format('INSERT INTO magazines(title, publisher, publicationDate, language, isbn10, isbn13) VALUES (?, ?, ?, ?, ?, ?)',
                [fields['title'], fields['publisher'], moment(fields['publicationDate']).format('YYYY-MM-DD HH:mm:ss'), fields['language'], fields['isbn10'], fields['isbn13']]);
            copiesTable = 'magazine_copies';
            copiesFK = 'magazine_id';
        } else if (type === 'Music') {
            query = db.format('INSERT INTO music(type, title, artist, label, releaseDate, asin) VALUES (?, ?, ?, ?, ?, ?)',
                [fields['type'], fields['title'], fields['artist'], fields['label'], moment(fields['releaseDate']).format('YYYY-MM-DD HH:mm:ss'), fields['asin']]);
            copiesTable = 'music_copies';
            copiesFK = 'music_id';
        } else if (type === 'Movie') {
            query = db.format('INSERT INTO movies(title, director, producers, actors, language, subtitles, dubbed, releaseDate, runtime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [fields['title'], fields['director'], fields['producers'], fields['actors'], fields['language'],
                    fields['subtitles'], fields['dubbed'], moment(fields['releaseDate']).format('YYYY-MM-DD HH:mm:ss'), fields['runtime']]);
            copiesTable = 'movie_copies';
            copiesFK = 'movie_id';
        } else {
            callback(new Error('Invalid Type'));
            return;
        }
        db.query(query, (err, rows) => {
            if (err || !fields.copies.length) {
                callback(err);
                return;
            }
            this._upsertCopies(copiesTable, fields.copies, copiesFK, rows.insertId, callback);
        });
    }

    static editMedia(type, id, fields, callback) {
        var query, copiesTable, copiesFK;
        if (type === 'Book') {
            query = db.format('UPDATE books SET title = ?, language = ?, isbn10 = ?, isbn13 = ?, ' +
                'publisher = ?, publicationDate = ?, author = ?, format = ?, pages = ? WHERE id = ?', [fields['title'], fields['language'],
                fields['isbn10'], fields['isbn13'], fields['publisher'], moment(fields['publicationDate']).format('YYYY-MM-DD HH:mm:ss'),
                fields['author'], fields['format'], fields['pages'], id]);
            copiesTable = 'book_copies';
            copiesFK = 'book_id';
        } else if (type === 'Magazine') {
            query = db.format('UPDATE magazines SET title = ?, language = ?, isbn10 = ?, isbn13 = ?, ' +
                'publisher = ?, publicationDate = ? WHERE id = ?', [fields['title'], fields['language'],
                fields['isbn10'], fields['isbn13'], fields['publisher'], moment(fields['publicationDate']).format('YYYY-MM-DD HH:mm:ss'), id]);
            copiesTable = 'magazine_copies';
            copiesFK = 'magazine_id';
        } else if (type === 'Music') {
            query = db.format('UPDATE music SET title = ?, releaseDate = ?, type = ?, artist = ?, label = ?, asin = ? WHERE id = ?',
                [fields['title'], moment(fields['releaseDate']).format('YYYY-MM-DD HH:mm:ss'), fields['type'], fields['artist'], fields['label'], fields['asin'], id]);
            copiesTable = 'music_copies';
            copiesFK = 'music_id';
        } else if (type === 'Movie') {
            query = db.format('UPDATE movies SET title = ?, releaseDate = ?, director = ?, producers = ?, actors = ?,' +
                'language = ?, subtitles = ?, dubbed = ?, runtime = ? WHERE id = ?', [fields['title'], moment(fields['releaseDate']).format('YYYY-MM-DD HH:mm:ss'),
                fields['director'], fields['producers'], fields['actors'], fields['language'],
                fields['subtitles'], fields['dubbed'], fields['runtime'], id]);
            copiesTable = 'movie_copies';
            copiesFK = 'movie_id';
        } else {
            callback(new Error('Invalid Type'));
            return;
        }
        db.query(query, err => {
            if (err) {
                callback(err);
                return;
            }
            const copies = fields.copies.filter(copy => copy.name);
            const deletedCopyIds = fields.copies.filter(copy => !copy.name).map(copy => copy.id);
            if (deletedCopyIds && deletedCopyIds.length) {
                const deleteCopiesQuery = db.format(
                    'DELETE FROM ?? WHERE id IN (?) AND ??=?',
                    [
                        copiesTable,
                        deletedCopyIds,
                        copiesFK,
                        id
                    ]);
                db.query(deleteCopiesQuery, err => {
                    if (err) {
                        callback(err);
                        return;
                    }
                    if (copies && copies.length) {
                        this._upsertCopies(copiesTable, copies, copiesFK, id, callback);
                    } else {
                        callback(err);
                    }
                });
            } else if (copies && copies.length) {
                this._upsertCopies(copiesTable, copies, copiesFK, id, callback);
            } else {
                callback(err);
            }
        });
    }

    static findMediaById(type, id, callback) {
        var query;

        if (type === 'Book') {
            query = db.format('SELECT * FROM books WHERE id = ?',
                id);
        } else if (type === 'Magazine') {
            query = db.format('SELECT * FROM magazines WHERE id = ?',
                id);
        } else if (type === 'Music') {
            query = db.format('SELECT * FROM music WHERE id = ?',
                id);
        } else if (type === 'Movie') {
            query = db.format('SELECT * FROM movies WHERE id = ?',
                id);
        }

        db.query(query, (err, rows, fields) => {
            callback(err, rows);
        });
    }

    static findMedia(type, fields, callback) {
        var query;

        if (type === 'Book') {
            query = db.format('SELECT * FROM books WHERE isbn10 = ?',
                fields['isbn10']);
        } else if (type === 'Magazine') {
            query = db.format('SELECT * FROM magazines WHERE isbn10 = ?',
                fields['isbn10']);
        } else if (type === 'Music') {
            query = db.format('SELECT * FROM music WHERE asin = ?',
                fields['asin']);
        } else if (type === 'Movie') {
            query = db.format('SELECT * FROM movies WHERE title = ? AND releaseDate = ?',
                [fields['title'], fields['releaseDate']]);
        }

        db.query(query, (err, rows, fields) => {
            callback(err, rows);
        });
    }

    static deleteMedia(type, id, callback) {
        var query;

        if (type === 'Book') {
            query = db.format('DELETE FROM books WHERE id = ?',
                id);
        } else if (type === 'Magazine') {
            query = db.format('DELETE FROM magazines WHERE id = ?',
                id);
        } else if (type === 'Music') {
            query = db.format('DELETE FROM music WHERE id = ?',
                id);
        } else if (type === 'Movie') {
            query = db.format('DELETE FROM movies WHERE id = ?',
                id);
        }

        db.query(query, (err, rows, fields) => {
            callback(err);
        });
    }

    static getAll(callback) {
        var queryBook = `SELECT a.*,
                            CONCAT(
                                '{',
                                GROUP_CONCAT(CONCAT('"', b.id, '":"', b.name, '"') ORDER BY b.id DESC SEPARATOR ','),
                                '}'
                            ) as copies
                        FROM books AS a
                        LEFT JOIN book_copies AS b ON a.id = b.book_id
                        GROUP BY a.id;`;
        var queryMagazine = `SELECT a.*,
                                CONCAT(
                                    '{',
                                    GROUP_CONCAT(CONCAT('"', b.id, '":"', b.name, '"') ORDER BY b.id DESC SEPARATOR ','),
                                    '}'
                                ) as copies
                            FROM magazines AS a
                            LEFT JOIN magazine_copies AS b ON a.id = b.magazine_id
                            GROUP BY a.id;`;
        var queryMusic = `SELECT a.*,
                            CONCAT(
                                '{',
                                GROUP_CONCAT(CONCAT('"', b.id, '":"', b.name, '"') ORDER BY b.id DESC SEPARATOR ','),
                                '}'
                            ) as copies
                        FROM music AS a
                        LEFT JOIN music_copies AS b ON a.id = b.music_id
                        GROUP BY a.id;`;
        var queryMovie = `SELECT a.*,
                            CONCAT(
                                '{',
                                GROUP_CONCAT(CONCAT('"', b.id, '":"', b.name, '"') ORDER BY b.id DESC SEPARATOR ','),
                                '}'
                            ) as copies
                        FROM movies AS a
                        LEFT JOIN movie_copies AS b ON a.id = b.movie_id
                        GROUP BY a.id;`;

        var books = [];
        var magazines = [];
        var music = [];
        var movies = [];
        var media = [];

        db.query(queryBook, function(err, rows, fields) {
            if (err) {
                throw new Error('Error querying database.');
            }
            books = rows;

            db.query(queryMagazine, function(err, rows, fields) {
                if (err) {
                    throw new Error('Error querying database.');
                }
                magazines = rows;

                db.query(queryMusic, function(err, rows, fields) {
                    if (err) {
                        throw new Error('Error querying database.');
                    }
                    music = rows;

                    db.query(queryMovie, function(err, rows, fields) {
                        if (err) {
                            throw new Error('Error querying database.');
                        }
                        movies = rows;

                        media.push(books);
                        media.push(magazines);
                        media.push(music);
                        media.push(movies);
                        callback(err, media);
                    });
                });
            });
        });
    }

    static get(filters, ordering, callback) {
        if (!filters){
            this.getAll(callback);
        }
        var query = knex({
            client: 'mysql'
        });
    }
}
