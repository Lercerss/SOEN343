import { DatabaseManager } from './DatabaseManager';
import { connection as db } from './dbConnection';
import { Media } from '../models/Media';

export class MediaGateway extends DatabaseManager {
    static saveMedia(type, fields, callback) {
        this.findMedia(type, fields, (err, rows) => {
            if (err) {
                err = new Error('There was an error checking for the item\'s existence');
                callback(err, rows);
                return;
            }
            if (rows != null) {
                err = new Error('Media item already exists in the database');
                callback(err, rows);
                return;
            }
            var query;
            if (type === 'Book') {
                query = db.format('INSERT INTO book(title, author, format, pages, publisher, publicationDate, language, isbn10, isbn13) VALUES (?)',
                    fields);
                db.query(query, (err, rows, fields) => {
                    callback(err);
                });
            } else if (type === 'Magazine') {
                query = db.format('INSERT INTO magazine(title, publisher, publicationDate, language, isbn10, isbn13) VALUES (?)',
                    fields);
                db.query(query, (err, rows, fields) => {
                    callback(err);
                });
            } else if (type === 'Music') {
                query = db.format('INSERT INTO music(type, title, artist, label, releaseDate, asin) VALUES (?)',
                    fields);
                db.query(query, (err, rows, fields) => {
                    callback(err);
                });
            } else if (type === 'Movie') {
                query = db.format('INSERT INTO movie(title, director, producers, actors, language, subtitles, dubbed, releaseDate, runtime VALUES (?)',
                    fields);
                db.query(query, (err, rows, fields) => {
                    callback(err);
                });
            } else {
                err = new Error('Error in specified type');
                callback(err, rows);
            }
        });
    }

    static editMedia(type, fields, callback) {
        this.findMedia(type, fields, (err, rows) => {
            if (err) {
                err = new Error('There was an error checking for the item\'s existence');
                callback(err, rows);
                return;
            }
            if (rows == null) {
                err = new Error('Media item does not exist in the database');
                callback(err, rows);
                return;
            }

            var query;
            if (type === 'Book') {

            } else if (type === 'Magazine') {

            } else if (type === 'Music') {

            } else if (type === 'Movie') {

            } else {

            }
        });
    }

    static findMedia(type, fields, callback) {
        var mediaTitle = fields['title'];

        const SQLQuery = db.format('SELECT * FROM ? WHERE title=?', [
            type,
            mediaTitle
        ]);

        db.query(SQLQuery, (err, rows, fields) => {
            MediaGateway.jsonToMedia(err, rows, fields, callback);
        });
    }

    static deleteMedia(type, fields, callback) {
        this.findMedia(type, fields, (err, rows) => {
            if (err) {
                throw new Error('Media does not exist');
            }
            var query;

            if (type === 'Book') {
                query = db.format('DELETE FROM book WHERE isbn10 = ?',
                    fields['isbn10']);
            } else if (type === 'Magazine') {
                query = db.format('DELETE FROM magazine WHERE isbn10 = ?',
                    fields['isbn10']);
            } else if (type === 'Music') {
                query = db.format('DELETE FROM music WHERE asin = ?',
                    fields['asin']);
            } else if (type === 'Movie') {
                query = db.format('DELETE FROM movie WHERE title = ? AND releaseDate = ?',
                    [fields['title'], fields['releaseDate']]);
            }

            db.query(query, (err, rows, fields) => {
            callback(err);
        });
        });
    }

    static getAll(callback) {
        // insert code that connects the four tablesz
    }

    static jsonToMedia(err, jsonArray, fields, callback) {
        if (err) {
            callback(err, []);
        }
        var mediaArray = [];
        for (var mediaJson of jsonArray) {
            var media = new Media(mediaJson);
            mediaArray.push(media);
        }
        callback(err, mediaArray);
    }
}

