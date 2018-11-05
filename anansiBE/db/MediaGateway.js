import { DatabaseManager } from './DatabaseManager';
import moment from 'moment';

const db = DatabaseManager.getConnection();

export class MediaGateway {
    static saveMedia(type, fields, callback) {
        var query;
        if (type === 'Book') {
            query = db.format(
                'INSERT INTO books(title, author, format, pages, publisher, publicationDate, language, isbn10, isbn13) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    fields['title'],
                    fields['author'],
                    fields['format'],
                    fields['pages'],
                    fields['publisher'],
                    moment(fields['publicationDate']).format('YYYY-MM-DD HH:mm:ss'),
                    fields['language'],
                    fields['isbn10'],
                    fields['isbn13']
                ]
            );
            db.query(query, (err, rows, fields) => {
                callback(err);
            });
        } else if (type === 'Magazine') {
            query = db.format(
                'INSERT INTO magazines(title, publisher, publicationDate, language, isbn10, isbn13) VALUES (?, ?, ?, ?, ?, ?)',
                [
                    fields['title'],
                    fields['publisher'],
                    moment(fields['publicationDate']).format('YYYY-MM-DD HH:mm:ss'),
                    fields['language'],
                    fields['isbn10'],
                    fields['isbn13']
                ]
            );
            db.query(query, (err, rows, fields) => {
                callback(err);
            });
        } else if (type === 'Music') {
            query = db.format(
                'INSERT INTO music(type, title, artist, label, releaseDate, asin) VALUES (?, ?, ?, ?, ?, ?)',
                [
                    fields['type'],
                    fields['title'],
                    fields['artist'],
                    fields['label'],
                    moment(fields['releaseDate']).format('YYYY-MM-DD HH:mm:ss'),
                    fields['asin']
                ]
            );
            db.query(query, (err, rows, fields) => {
                callback(err);
            });
        } else if (type === 'Movie') {
            query = db.format(
                'INSERT INTO movies(title, director, producers, actors, language, subtitles, dubbed, releaseDate, runtime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    fields['title'],
                    fields['director'],
                    fields['producers'],
                    fields['actors'],
                    fields['language'],
                    fields['subtitles'],
                    fields['dubbed'],
                    moment(fields['releaseDate']).format('YYYY-MM-DD HH:mm:ss'),
                    fields['runTime']
                ]
            );
            db.query(query, (err, rows, fields) => {
                callback(err);
            });
        }
    }

    static editMedia(type, id, fields, callback) {
        var query;
        if (type === 'Book') {
            query = db.format(
                'UPDATE books SET title = ?, language = ?, isbn10 = ?, isbn13 = ?, ' +
                    'publisher = ?, publicationDate = ?, author = ?, format = ?, pages = ? WHERE id = ?',
                [
                    fields['title'],
                    fields['language'],
                    fields['isbn10'],
                    fields['isbn13'],
                    fields['publisher'],
                    moment(fields['publicationDate']).format('YYYY-MM-DD HH:mm:ss'),
                    fields['author'],
                    fields['format'],
                    fields['pages'],
                    id
                ]
            );
            db.query(query, (err, rows) => {
                callback(err);
            });
        } else if (type === 'Magazine') {
            query = db.format(
                'UPDATE magazines SET title = ?, language = ?, isbn10 = ?, isbn13 = ?, ' +
                    'publisher = ?, publicationDate = ? WHERE id = ?',
                [
                    fields['title'],
                    fields['language'],
                    fields['isbn10'],
                    fields['isbn13'],
                    fields['publisher'],
                    moment(fields['publicationDate']).format('YYYY-MM-DD HH:mm:ss'),
                    id
                ]
            );
            db.query(query, (err, rows) => {
                callback(err);
            });
        } else if (type === 'Music') {
            query = db.format(
                'UPDATE music SET title = ?, releaseDate = ?, type = ?, artist = ?, label = ?, asin = ? WHERE id = ?',
                [
                    fields['title'],
                    moment(fields['releaseDate']).format('YYYY-MM-DD HH:mm:ss'),
                    fields['type'],
                    fields['artist'],
                    fields['label'],
                    fields['asin'],
                    id
                ]
            );
            db.query(query, (err, rows) => {
                callback(err);
            });
        } else if (type === 'Movie') {
            query = db.format(
                'UPDATE movies SET title = ?, releaseDate = ?, director = ?, producers = ?, actors = ?,' +
                    'language = ?, subtitles = ?, dubbed = ?, runtime = ? WHERE id = ?',
                [
                    fields['title'],
                    moment(fields['releaseDate']).format('YYYY-MM-DD HH:mm:ss'),
                    fields['director'],
                    fields['producers'],
                    fields['actors'],
                    fields['language'],
                    fields['subtites'],
                    fields['dubbed'],
                    fields['runtime'],
                    id
                ]
            );
            db.query(query, (err, rows) => {
                callback(err);
            });
        }
    }

    static findMediaById(type, id, callback) {
        var query;

        if (type === 'Book') {
            query = db.format('SELECT * FROM books WHERE id = ?', id);
        } else if (type === 'Magazine') {
            query = db.format('SELECT * FROM magazines WHERE id = ?', id);
        } else if (type === 'Music') {
            query = db.format('SELECT * FROM music WHERE id = ?', id);
        } else if (type === 'Movie') {
            query = db.format('SELECT * FROM movies WHERE id = ?', id);
        }

        db.query(query, (err, rows, fields) => {
            callback(err, rows);
        });
    }

    static findMedia(type, fields, callback) {
        var query;

        if (type === 'Book') {
            query = db.format('SELECT * FROM books WHERE isbn10 = ?', fields['isbn10']);
        } else if (type === 'Magazine') {
            query = db.format('SELECT * FROM magazines WHERE isbn10 = ?', fields['isbn10']);
        } else if (type === 'Music') {
            query = db.format('SELECT * FROM music WHERE asin = ?', fields['asin']);
        } else if (type === 'Movie') {
            query = db.format('SELECT * FROM movies WHERE title = ? AND releaseDate = ?', [
                fields['title'],
                fields['releaseDate']
            ]);
        }

        db.query(query, (err, rows, fields) => {
            callback(err, rows);
        });
    }

    static deleteMedia(type, id, callback) {
        var query;

        if (type === 'Book') {
            query = db.format('DELETE FROM books WHERE id = ?', id);
        } else if (type === 'Magazine') {
            query = db.format('DELETE FROM magazines WHERE id = ?', id);
        } else if (type === 'Music') {
            query = db.format('DELETE FROM music WHERE id = ?', id);
        } else if (type === 'Movie') {
            query = db.format('DELETE FROM movies WHERE id = ?', id);
        }

        db.query(query, (err, rows, fields) => {
            callback(err);
        });
    }

    static getItems(filters, ordering, callback) {
        if (!filters.mediaType) {
            var title = filters.fields.title ? ' WHERE title LIKE \'%' + filters.fields.title + '%\'' : '';
            var queryBook = 'SELECT * FROM books' + title;
            var queryMagazine = 'SELECT * FROM magazines' + title;
            var queryMusic = 'SELECT * FROM music' + title;
            var queryMovie = 'SELECT * FROM movies' + title;

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
        } else {
            var query = 'SELECT * FROM ' + filters.mediaType;
            if (Object.keys(filters.fields).length !== 0) {
                query = query + ' WHERE ';
                var fieldArray = [];
                Object.keys(filters.fields).forEach(function(key) {
                    fieldArray.push(key + " LIKE '%" + filters.fields[key] + "%'");
                });
                query = query + fieldArray.join(' AND ');
            }
            if (Object.keys(ordering).length !== 0) {
                query = query + ' ORDER BY ';
                fieldArray = [];
                Object.keys(ordering).forEach(function(key) {
                    fieldArray.push(key + ' ' + ordering[key]);
                });
                query = query + fieldArray.join(', ');
            }
            db.query(query, function(err, rows, fields) {
                if (err) {
                    throw new Error('Error querying database.');
                }
                callback(err, [rows]);
            });
        }
    }
}
