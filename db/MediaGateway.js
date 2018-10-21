import { DatabaseManager } from './DatabaseManager';
import { connection as db } from './dbConnection';

export class MediaGateway extends DatabaseManager {
    static saveMedia(type, fields, callback) {
        this.findMedia(type, title);
    }

    static editMedia(type, fields, callback) {
        const SQLQuery = db.format('SELECT * FROM ? WHERE title=?' [
            type,
            title
        ]);

        if (type === 'Book') {
        } else if (type === 'Magazine') {

        } else if (type === 'Music') {

        } else if (type === 'Movie') {

        } else {
             //// error statement will be included once we figure something out for logical stuff.
        }
       

    }

    static findMedia(type, fields, callback) {
        var mediaTitle = fields['title'];

        const SQLQuery = db.format('SELECT * FROM ? WHERE title=?', [
            type,
            mediaTitle
        ]);

        db.query(SQLQuery, (err, rows, fields) => {
            MediaGateway.jsonToMedia(err, rows, fields, callback);
        })
    }

    static deleteMedia(type, fields, callback) {
        var mediaTitle = fields['title'];
        findMedia(type, fields, (err, rows) => {
            if (err) {
                err = new Error('Media does not exist');
                return;
            }
        });

        const SQLQuery = db.format('REMOVE * FROM ? WHERE title=?' [
            type,
            mediaTitle
        ]);

        db.query(SQLQuery, (err, rows, fields) => {
            callback(err);
        });
        
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
    static getAll(callback) {
        // insert code that connects the four tablesz
    }

}

