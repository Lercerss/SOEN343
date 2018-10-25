export class Media {
    constructor(mediaJSON) {
        this.id = mediaJSON.id;
        this.title = mediaJSON.title;
    }

    getID() {
        return this.id;
    }

    compare() {

    }
}
