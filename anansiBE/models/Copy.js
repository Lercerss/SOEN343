export class Copy {
    constructor(copyJSON) {
        this.id = copyJSON.id;
        this.name = copyJSON.name;
        this.available = Boolean(copyJSON.available);
    }
}
