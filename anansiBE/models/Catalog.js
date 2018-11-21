import { Book } from './Book';
import { Magazine } from './Magazine';
import { Movie } from './Movie';
import { Music } from './Music';
import { MediaGateway } from '../db/MediaGateway';

const pageSize = 15;
const lockedTimeout = 10 * 60 * 1000;

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

    static editItem(type, fields, userId, callback) {
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
                var timePassed = Date.now() - rows[0].lockedAt;
                if (rows[0].lockedBy_id === userId && timePassed < lockedTimeout){
                    MediaGateway.editMedia(type, id, fields, callback);
                } else {
                    let error = new Error('Media is currently being edited by another user');
                    error.code = 400;
                    callback(error);
                }
            });
        });
    }

    static getLock(type, userId, mediaId, callback) {
        MediaGateway.findMediaById(type, mediaId, (err, rows) => {
            if (err) {
                err.code = 500;
                callback(err);
                return;
            } else if (rows.length === 0) {
                let error = new Error('Media item does not exist in the database');
                error.code = 500;
                callback(error);
                return;
            }
            var timePassed = Date.now() - rows[0].lockedAt;
            var unlockTimeInSeconds = rows[0].lockedAt + lockedTimeout;
            var unlockTime = new Date(unlockTimeInSeconds).toString();

            if (rows[0].lockedBy_id !== null && timePassed < lockedTimeout && rows[0].lockedBy_id !== userId) {
                let error = new Error('Media item is currently being edited by another user try again at ' + unlockTime);
                error.code = 409;
                callback(error);
            } else if (rows[0].lockedBy_id === userId) {
                callback(null, [parseInt(Date.parse(rows[0].lockedAt) / 1000)]);
            } else {
                MediaGateway.getLock(type, userId, mediaId, (err, rows) => {
                    if (err){
                        var error = new Error('There was an error querying the database');
                        error.code = 500;
                        callback(error, rows);
                        return;
                    }
                    callback(err, [parseInt(Date.now() / 1000)]);
                });
            }
        });
    }

    static releaseLock(type, userId, mediaId, callback) {
        MediaGateway.findMediaById(type, mediaId, (err, rows) => {
            if (err) {
                err.code(500);
                callback(err);
                return;
            } else if (rows.length === 0) {
                let error = new Error('Media item does not exist in the database');
                error.code = 500;
                callback(error);
                return;
            }
            if (rows[0].lockedBy_id === userId) {
                MediaGateway.releaseLock(type, userId, mediaId, (err, rowa) => {
                    if (err){
                        let error = new Error('Media item is locked by another user');
                        error.code = 403;
                        callback(error);
                        return;
                    }
                    callback(err, rows);
                });
            }
        });
    }

    static viewItems(nPage, filters, ordering, callback) {
        var mediaArray = [];
        var jsonArray = [];
        MediaGateway.getItems(filters, ordering, function(err, media) {
            if (err) {
                callback(err);
                return;
            }
            jsonArray = media;

            mediaArray = Catalog.jsonToMedia(jsonArray);
            let size = mediaArray.length;
            mediaArray.slice(nPage * (pageSize - 1), nPage * pageSize);
            callback(err, mediaArray, size);
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

    static returnCopies(loans, clientID, callback) {
        if (loans.length > 0) {
            MediaGateway.updateLoans(loans, clientID, callback);
        } else {
            let err = new Error('List of return must be greater than 0');
            err.httpStatusCode = 400;
            callback(err);
        }
    }

    static jsonToMedia(jsonArray) {
        var mediaArray = [];

        jsonArray.forEach(el => {
            var media;

            if (el.mediaType === 'Book') {
                media = new Book(el);
            } else if (el.mediaType === 'Magazine') {
                media = new Magazine(el);
            } else if (el.mediaType === 'Movie') {
                media = new Movie(el);
            } else if (el.mediaType === 'Music') {
                media = new Music(el);
            }
            media.copies = JSON.parse(el.copies);

            mediaArray.push(media);
        });

        return mediaArray;
    }
}
