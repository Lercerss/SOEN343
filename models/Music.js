import { DigitalMedia } from './DigitalMedia';

export class Music extends DigitalMedia {
    constructor(userJSON) {
        super(userJSON);
        this.type = userJSON.type;
        this.artist = userJSON.artist;
        this.label = userJSON.label;
        this.asin = userJSON.asin;
    }
}
