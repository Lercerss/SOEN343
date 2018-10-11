import { Book } from './Book' ;
import { Magazine } from './Magazine' ;
import { Movie } from './Movie' ;
import { Music } from './Music' ;

var id = 0;
export class Catalog {
    mediaList = new Array();
  
    static addItem(type, fields, callback) {
        console.log(fields);
        if (type == 'Book'){
           var bookDict = { 
                title: fields.title,
                author: fields.author,
                format: fields.author,
                pages: fields.pages,
                publisher: fields.publisher,
                language: fields.language,
                isbn10: fields.isbn10,
                isbn13: fields.isbn13
           }
           var book = new Book(bookDict);
           mediaList.push(book);
           callback(err);
        }
        else if (type == 'Magazine'){
            var magazineDict = {
                title: fields.title,
                publisher: fields.publisher,
                language: fields.language,
                isbn10: fields.isbn10,
                isbn13: fields.isbn13
            }
            var magazine = new Magazine(magazineDict);
            mediaList.push(magazine);
            callback(err);
        }
        else if (type == 'Music'){
            var musicDict = {
                title: fields.title,
                artist: fields.artist,
                label: fields.label,
                releaseDate: fields.releaseDate,
                asin: fields.asin
            }
            var music = new Music(musicDict);
            mediaList.push(music);
            callback(err);
        }
        else (type == 'Movie'){
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
            }
            var movie = new Movie(movieDict);
            mediaList.push(movie);
            callback(err);
        }    
    }

    static editem(type, fields) {

    }

    static viewItems() {

    }

    static searchItem(type, fields, callback){
        for(var item of mediaList){
            if (type == 'Book' && item instanceof Book){
                if(fields.isbn10 == item.isbn10){
                    callback(err, item);
                }
            } else if (type == 'Magazine' && instanceof Magazine ){
                if(fields.isbn10 == item.isbn10){
                    callback(err, item);
                }                
            } else if (type == 'Music' && item instanceof Music){
                if(fields.asin == item.asin){
                    callback(err, item);
                }                
            } else (type == 'Movie' && item instanceof Movie){
                if(fields.title == item.title && fields.releaseDate == item.releaseDate){
                    callback(err, item);
                }                
            }
        } 
        callback(err, item);
    }
}