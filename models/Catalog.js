import { Book } from './Book';
import { Magazine } from './Magazine';
import { Movie } from './Movie';
import { Music } from './Music';
import { MediaGateway } from '../db/MediaGateway';
import { Media } from './Media';

export class Catalog {
    static addItem(type, fields, callback) {
        MediaGateway.findMedia(type, fields, (err, rows) => {
            /* gives an error if the item doesn't exist
            if (err) {
                err = new Error('There was an error checking for the item\'s existence');
                callback(err, rows);
                return;
            }
            */
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

    static viewItems(callback) {
        var mediaArray = [];
        var jsonArray = [];
        MediaGateway.getAll(function(err, media) {
            if (err) {
                throw new Error('Error retrieving media items');
            }
            jsonArray = media;
            mediaArray = Catalog.jsonToMedia(jsonArray);

            callback(mediaArray);
        });
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

    static jsonToMedia(jsonArray) {
        var mediaArray = [];

        for (var i = 0; i < jsonArray.length; i++) {
            for (var mediaJson of jsonArray[i]) {
                var media;
                if (i === 0) { // book type
                    media = new Book(mediaJson);
                } else if (i === 1) { // magazine type
                    media = new Magazine(mediaJson);
                } else if (i === 2) { // movie type
                    media = new Music(mediaJson);
                } else if (i === 3) { // music type
                    media = new Movie(mediaJson);
                }
                mediaArray.push(media);
            }
        }
        return mediaArray;
    }
}
