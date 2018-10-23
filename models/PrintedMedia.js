import { Media } from './Media';

export class PrintedMedia extends Media {
    constructor(userJSON) {
        super(userJSON);
        this.publisher = userJSON.publisher;
        this.language = userJSON.language;
        this.isbn10 = userJSON.isbn10;
        this.isbn13 = userJSON.isbn13;
        this.publicationDate = userJSON.publicationDate;
    }
}
