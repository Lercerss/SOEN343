import { Media } from './Media';

export class DigitalMedia extends Media {
    constructor(userJSON) {
        super(userJSON);
        this.releaseDate = userJSON.releaseDate;
    }
}
