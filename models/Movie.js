import { DigitalMedia } from './DigitalMedia';

export class Movie extends DigitalMedia {
    constructor(userJSON) {
        super(userJSON);
        this.director = userJSON.director;
        this.producers = userJSON.producers;
        this.actors = userJSON.actors;
        this.language = userJSON.language;
        this.subtitles = userJSON.subtitles;
        this.dubbed = userJSON.dubbed;
        this.runTime = userJSON.runtime;
    }
}
