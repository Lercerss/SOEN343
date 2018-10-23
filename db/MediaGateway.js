import { DatabaseManager } from './DatabaseManager';
import { connection as db } from './dbConnection';

export class MediaGateway extends DatabaseManager {
    static saveMedia(type, fields, callback) {
        var query;
        if (type === 'Book') {
            query = db.format('INSERT INTO books(title, author, format, pages, publisher, publicationDate, language, isbn10, isbn13) VALUES (?)',
                [fields['title'], fields['author'], fields['format'], fields['pages'], fields['publisher'], fields['publicationDate'],
                    fields['language'], fields['isbn10'], fields['isbn13']]);
            db.query(query, (err, rows, fields) => {
                callback(err);
            });
        } else if (type === 'Magazine') {
            query = db.format('INSERT INTO magazines(title, publisher, publicationDate, language, isbn10, isbn13) VALUES (?)',
                [fields['title'], fields['publisher'], fields['publicationDate'], fields['language'], fields['isbn10'], fields['isbn13']]);
            db.query(query, (err, rows, fields) => {
                callback(err);
            });
        } else if (type === 'Music') {
            query = db.format('INSERT INTO music(type, title, artist, label, releaseDate, asin) VALUES (?)',
                [fields['type'], fields['title'], fields['artist'], fields['label'], fields['releaseDate'], fields['asin']]);
            db.query(query, (err, rows, fields) => {
                callback(err);
            });
        } else if (type === 'Movie') {
            query = db.format('INSERT INTO movies(title, director, producers, actors, language, subtitles, dubbed, releaseDate, runtime VALUES (?)',
                [fields['title'], fields['releaseDate'], fields['director'], fields['producers'], fields['actors'], fields['language'],
                    fields['subtites'], fields['dubbed'], fields['runtime'], fields['title'], fields['releaseDate']]);
            db.query(query, (err, rows, fields) => {
                callback(err);
            });
        }
    }

    static editMedia(type, fields, callback) {
        var query;
        if (type === 'Book') {
            query = db.format('UPDATE books SET title = ?, language = ?, isbn10 = ?, isbn13 = ?,' +
                'publisher = ? publicationDate = ?, author = ?, format = ?, pages = ? WHERE isbn10 = ?', [fields['title'], fields['language'],
                fields['isbn10'], fields['isbn13'], fields['publisher'], fields['publicationDate'],
                fields['author'], fields['format'], fields['pages'], fields['isbn10']]);
            db.query(query, (err, rows, fields) => {
                callback(err);
            });
        } else if (type === 'Magazine') {
            query = db.format('UPDATE magazines SET title = ?, language = ?, isbn10 = ?, isbn13 = ? WHERE isbn10 = ?' +
                'publisher = ? publicationDate = ?', [fields['title'], fields['language'],
                fields['isbn10'], fields['isbn13'], fields['publisher'], fields['publicationDate'], fields['isbn10']]);
            db.query(query, (err, rows, fields) => {
                callback(err);
            });
        } else if (type === 'Music') {
            query = db.format('UPDATE music SET title = ?, releaseDate = ?, type = ?, artist = ?, label = ?, asin = ? WHERE asin = ?',
                [fields['title'], fields['releaseDate'], fields['type'], fields['artist'], fields['label'], fields['asin'], fields['asin']]);
            db.query(query, (err, rows, fields) => {
                callback(err);
            });
        } else if (type === 'Movie') {
            query = db.format('UPDATE movies SET title = ?, releaseDate = ?, director = ?, producers = ?, actors = ?,' +
                'language = ?, subtitles = ?, dubbed = ?, runtime = ? WHERE title = ? AND releaseDate = ?', [fields['title'], fields['releaseDate'],
                fields['director'], fields['producers'], fields['actors'], fields['language'],
                fields['subtites'], fields['dubbed'], fields['runtime'], fields['title'], fields['releaseDate']]);
            db.query(query, (err, rows, fields) => {
                callback(err);
            });
        }
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
            MediaGateway.jsonToMedia(err, rows, fields, callback);
        });
    }

    static deleteMedia(type, fields, callback) {
        var query;

        if (type === 'Book') {
            query = db.format('DELETE FROM books WHERE isbn10 = ?',
                fields['isbn10']);
        } else if (type === 'Magazine') {
            query = db.format('DELETE FROM magazines WHERE isbn10 = ?',
                fields['isbn10']);
        } else if (type === 'Music') {
            query = db.format('DELETE FROM music WHERE asin = ?',
                fields['asin']);
        } else if (type === 'Movie') {
            query = db.format('DELETE FROM movies WHERE title = ? AND releaseDate = ?',
                [fields['title'], fields['releaseDate']]);
        }

        db.query(query, (err, rows, fields) => {
            callback(err);
        });
    }

    static getAll(callback) {
        var queryBook = 'SELECT * FROM books';
        var queryMagazine = 'SELECT * FROM magazines';
        var queryMusic = 'SELECT * FROM music';
        var queryMovie = 'SELECT * FROM movies';

        var books = [];
        db.query(queryBook, function(err, results, fields) {
            if (err) {
                throw new Error('Error querying database.');
            }
            books = results;
        });

        var magazines = [];
        db.query(queryMagazine, function(err, results, fields) {
            if (err) {
                throw new Error('Error querying database.');
            }
            magazines = results;
        });

        var music = [];
        db.query(queryMusic, function(err, results, fields) {
            if (err) {
                throw new Error('Error querying database.');
            }
            music = results;
        });

        var movies = [];
        db.query(queryMovie, function(err, results, fields) {
            if (err) {
                throw new Error('Error querying database.');
            }
            movies = results;
        });

        var media = [];
        media.push(books);
        media.push(magazines);
        media.push(music);
        media.push(movies);

        return media;
    }
}
