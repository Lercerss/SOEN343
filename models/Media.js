export class Media {
    constructor(userJSON) {
        this.id = userJSON.id;
        this.title = userJSON.title;
    }

    getID() {
        return this.id;
    }

    compare() {

    }
}
