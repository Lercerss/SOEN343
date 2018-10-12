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
            }
            if (item !== null) {
                err = new Error('Item already exists');
                callback(err, item);
            }
            if (type === 'Book') {
                var bookDict = {
                    title: fields.title,
                    author: fields.author,
                    format: fields.format,
                    pages: fields.pages,
                    publisher: fields.publisher,
                    language: fields.language,
                    isbn10: fields.isbn10,
                    isbn13: fields.isbn13
                };
                var book = new Book(bookDict);
                mediaList.push(book);
                callback(err, item);
            } else if (type === 'Magazine') {
                var magazineDict = {
                    title: fields.title,
                    publisher: fields.publisher,
                    language: fields.language,
                    isbn10: fields.isbn10,
                    isbn13: fields.isbn13
                };
                var magazine = new Magazine(magazineDict);
                mediaList.push(magazine);
                callback(err, item);
            } else if (type === 'Music') {
                var musicDict = {
                    title: fields.title,
                    artist: fields.artist,
                    label: fields.label,
                    releaseDate: fields.releaseDate,
                    asin: fields.asin
                };
                var music = new Music(musicDict);
                mediaList.push(music);
                callback(err, item);
            } else if (type === 'Movie') {
                var movieDict = {
                    title: fields.title,
                    director: fields.director,
                    producers: fields.producers,
                    actors: fields.actors,
                    language: fields.language,
                    subtitles: fields.subtitles,
                    dubbed: fields.dubbed,
                    releaseDate: fields.releaseDate,
                    runTime: fields.runTime
                };
                var movie = new Movie(movieDict);
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
            }
            if (item == null) {
                err = new Error('Item could not be found');
                callback(err, item);
            }
            if (type === 'Book') {
                var bookDict = {
                    title: fields.title,
                    author: fields.author,
                    format: fields.format,
                    pages: fields.pages,
                    publisher: fields.publisher,
                    language: fields.language,
                    isbn10: fields.isbn10,
                    isbn13: fields.isbn13
                };
                var book = new Book(bookDict);
                mediaList[index] = book;
                callback(err, item);
            } else if (type === 'Magazine') {
                var magazineDict = {
                    title: fields.title,
                    publisher: fields.publisher,
                    language: fields.language,
                    isbn10: fields.isbn10,
                    isbn13: fields.isbn13
                };
                var magazine = new Magazine(magazineDict);
                mediaList[index] = magazine;
                callback(err, item);
            } else if (type === 'Music') {
                var musicDict = {
                    title: fields.title,
                    artist: fields.artist,
                    label: fields.label,
                    releaseDate: fields.releaseDate,
                    asin: fields.asin
                };
                var music = new Music(musicDict);
                mediaList[index] = music;
                callback(err, item);
            } else if (type === 'Movie') {
                var movieDict = {
                    title: fields.title,
                    director: fields.director,
                    producers: fields.producers,
                    actors: fields.actors,
                    language: fields.language,
                    subtitles: fields.subtitles,
                    dubbed: fields.dubbed,
                    releaseDate: fields.releaseDate,
                    runTime: fields.runTime
                };
                var movie = new Movie(movieDict);
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
                }
            } else if (type === 'Magazine' && item instanceof Magazine) {
                if (fields.isbn10 === item.isbn10) {
                    callback(err, item, index);
                }
            } else if (type === 'Music' && item instanceof Music) {
                if (fields.asin === item.asin) {
                    callback(err, item, index);
                }
            } else if (type === 'Movie' && item instanceof Movie) {
                if (fields.title === item.title && fields.releaseDate === item.releaseDate) {
                    callback(err, item, index);
                }
            }
            index++;
        }
        callback(err, item, index);
    }
}
