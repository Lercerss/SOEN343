import { Book } from './Book';
import { Magazine } from './Magazine';
import { Movie } from './Movie';
import { Music } from './Music';

var mediaList = new Array();

export class Catalog {
    static addItem(type, fields, callback) {
        console.log(fields);
        this.searchItem(type, fields, (err, item, index) => {
            if (err) {
                err = new Error('There was an error checking for item existence');
                callback(err, item);
                return;
            }
            if (item !== null) {
                err = new Error('Item already exists');
                callback(err, item);
                return;
            }
            if (type === 'Book') {
                var book = new Book(fields);
                mediaList.push(book);
                callback(err, item);
            } else if (type === 'Magazine') {
                var magazine = new Magazine(fields);
                mediaList.push(magazine);
                callback(err, item);
            } else if (type === 'Music') {
                var music = new Music(fields);
                mediaList.push(music);
                callback(err, item);
            } else if (type === 'Movie') {
                var movie = new Movie(fields);
                mediaList.push(movie);
                callback(err, item);
            } else {
                err = new Error('Error in type specified.');
                callback(err, item);
            }
        });
    }

    static editItem(type, fields, callback) {
        console.log(fields);
        this.searchItem(type, fields, (err, item, index) => {
            if (err) {
                err = new Error('There was an error checking for item existence');
                callback(err, item);
                return;
            }
            if (item == null) {
                err = new Error('Item could not be found');
                callback(err, item);
                return;
            }
            if (type === 'Book') {
                var book = new Book(fields);
                mediaList[index] = book;
                callback(err, item);
            } else if (type === 'Magazine') {
                var magazine = new Magazine(fields);
                mediaList[index] = magazine;
                callback(err, item);
            } else if (type === 'Music') {
                var music = new Music(fields);
                mediaList[index] = music;
                callback(err, item);
            } else if (type === 'Movie') {
                var movie = new Movie(fields);
                mediaList[index] = movie;
                callback(err, item);
            } else {
                err = new Error('Error in type specified.');
                callback(err, item);
            }
        });
    }

    static viewItems() {
        return mediaList;
    }

    static searchItem(type, fields, callback) {
        var err = null;
        var index = 0;

        for (var item of mediaList) {
            if (type === 'Book' && item instanceof Book) {
                if (fields.isbn10 === item.isbn10) {
                    callback(err, item, index);
                    return;
                }
            } else if (type === 'Magazine' && item instanceof Magazine) {
                if (fields.isbn10 === item.isbn10) {
                    callback(err, item, index);
                    return;
                }
            } else if (type === 'Music' && item instanceof Music) {
                if (fields.asin === item.asin) {
                    callback(err, item, index);
                    return;
                }
            } else if (type === 'Movie' && item instanceof Movie) {
                if (fields.title === item.title && fields.releaseDate === item.releaseDate) {
                    callback(err, item, index);
                    return;
                }
            }
            index++;
        }
        callback(err, item, index);
    }
}
