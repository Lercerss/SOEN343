import { Book } from './Book';
import { Magazine } from './Magazine';
import { Movie } from './Movie';
import { Music } from './Music';
import { MediaGateway } from '../db/MediaGateway';
import { Media } from './Media';

var id = 0;
var mediaList = new Array();

export class Catalog {
    static addItem(type, fields, callback) {
        MediaGateway.findMedia(type, fields, (err, rows) => {
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
            MediaGateway.saveMedia(type, fields, callback);
        });
    }

    static editItem(type, fields, callback) {
        var id = fields['id'];

        MediaGateway.findMediaById(type, id, (err, rows) => {
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
            MediaGateway.editMedia(type, id, fields, callback);
        });
    }

    static viewItems() {
        return MediaGateway.getAll();
    }

    static searchItem(type, fields, callback) {
        MediaGateway.findMedia(type, fields, function(type, err, jsonArray) {
            this.jsonToMedia(type, err, jsonArray);
        });
    }

    static deleteItem(type, fields, callback){
        MediaGateway.findMedia(type, fields, (err, rows) => {
            if (err) {
                throw new Error('Media does not exist');
            }
            if (rows != null) {
                MediaGateway.deleteMedia(type, fields, callback);
            }
        });
    }

    static jsonToMedia(type, err, jsonArray, callback) {
        if (err) {
            callback(err, []);
        }
        var mediaArray = [];
        for (var mediaJson of jsonArray) {
            var media;
            if (type === 'book') {
                media = new Book(mediaJson);
            } else if (type === 'magazine') {
                media = new Magazine(mediaJson);
            } else if (type === 'movie') {
                media = new Movie(mediaJson);
            } else if (type === 'music') {
                media = new Music(mediaJson);
            }

            mediaArray.push(media);
        }
        callback(err, mediaArray);
    }
}
