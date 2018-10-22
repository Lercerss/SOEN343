import { Book } from './Book';
import { Magazine } from './Magazine';
import { Movie } from './Movie';
import { Music } from './Music';
import { MediaGateway } from '../db/MediaGateway';

var id = 0;
var mediaList = new Array();

export class Catalog {
    static addItem(type, fields, callback) {
        MediaGateway.saveMedia(type, fields, callback);
    }

    static editItem(type, fields, callback) {
        MediaGateway.editMedia(type, fields, callback);
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
        MediaGateway.deleteMedia(type, fields, callback);
    }
}
