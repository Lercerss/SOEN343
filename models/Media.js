export class Media {
    constructor(userJSON) {
        this.id = userJSON.id || userJSON.book_id || userJSON.magazine_id || userJSON.movie_id || userJSON.music_id;
        this.title = userJSON.title;
    }

    getID() {
        return this.id;
    }

    compare() {

    }
}
