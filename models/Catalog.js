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
            MediaGateway.editMedia(type, fields, callback);
        });
    }

    static viewItems() {
        return MediaGateway.getAll();
    }

    static searchItem(type, fields, callback) {
        MediaGateway.findMedia(type, fields, callback);
    }

    static searchByID(id, callback){
        var err = null;
        var index = 0;
        for (var item of mediaList){
            if (item.id === id) {
                callback(err, item, index);
                return;
            }
            index++;
        }
        callback(err, null, null);
    }

    static deleteItem(type, fields, callback){
        this.findMedia(type, fields, (err, rows) => {
            if (err) {
                throw new Error('Media does not exist');
            }
            MediaGateway.deleteMedia(type, fields, callback);
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
}
