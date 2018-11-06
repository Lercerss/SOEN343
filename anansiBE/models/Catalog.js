import { Book } from './Book';
import { Magazine } from './Magazine';
import { Movie } from './Movie';
import { Music } from './Music';
import { MediaGateway } from '../db/MediaGateway';

export class Catalog {
    static addItem(type, fields, callback) {
        MediaGateway.findMedia(type, fields, (err, rows) => {
            if (err) {
                err = new Error("There was an error checking for the item's existence");
                callback(err, rows);
                return;
            }
            if (rows.length !== 0) {
                err = new Error('Media item already exists in the database');
                callback(err, rows);
                return;
            }

            MediaGateway.saveMedia(type, fields, callback);
        });
    }

    static editItem(type, fields, callback) {
        var id = fields['id'];

        MediaGateway.findMedia(type, fields, (err, rows) => {
            if (rows.length !== 0 && fields.id !== rows[0].id) {
                if (err) {
                    callback(err, null);
                    return;
                }
                callback(
                    new Error(
                        'Media item with the identifier you specified already exists in the database'
                    ),
                    rows
                );
                return;
            }
            MediaGateway.findMediaById(type, id, (err, rows) => {
                if (err) {
                    callback(err, null);
                    return;
                } else if (rows.length === 0) {
                    callback(new Error('Media item does not exist in the database'), rows);
                    return;
                }
                MediaGateway.editMedia(type, id, fields, callback);
            });
        });
    }

    static viewItems(callback) {
        var mediaArray = [];
        var jsonArray = [];
        MediaGateway.getAll(function(err, media) {
            if (err) {
                callback(new Error('Error retrieving media items'));
                return;
            }
            jsonArray = media;
            mediaArray = Catalog.jsonToMedia(jsonArray);
            callback(mediaArray);
        });
    }

    static deleteItem(type, id, callback) {
        MediaGateway.findMediaById(type, id, (err, rows) => {
            if (err) {
                callback(err);
                return;
            } else if (rows.length === 0) {
                callback(new Error('Media item does not exist in the database'));
                return;
            }
            MediaGateway.deleteMedia(type, id, callback);
        });
    }

    static jsonToMedia(jsonArray) {
        var mediaArray = [];

        for (var i = 0; i < jsonArray.length; i++) {
            for (var mediaJson of jsonArray[i]) {
                var media;
                if (i === 0) {
                    // book type
                    media = new Book(mediaJson);
                } else if (i === 1) {
                    // magazine type
                    media = new Magazine(mediaJson);
                } else if (i === 2) {
                    // movie type
                    media = new Music(mediaJson);
                } else if (i === 3) {
                    // music type
                    media = new Movie(mediaJson);
                }
                media.copies = JSON.parse(mediaJson.copies);
                mediaArray.push(media);
            }
        }
        return mediaArray;
    }
}
