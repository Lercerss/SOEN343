import { PrintedMedia } from './PrintedMedia';

export class Book extends PrintedMedia {
    constructor(userJSON) {
        super(userJSON);
        this.author = userJSON.author;
        this.format = userJSON.format;
        this.pages = userJSON.pages;
    }
}