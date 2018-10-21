import { DatabaseManager } from './DatabaseManager';
import { connection as db } from './dbConnection';

export class MediaGateway extends DatabaseManager {
    static saveMedia(type, fields, callback) {
        this.searchItem(type, fields, (err, item, index) => {
           if (err) {
               err = new Error('There was an error checking for item existence');
               callback(err, item);
               return;
           } 
        });
    }
    
    static editMedia(type, fields, callback) {

    }

    static findMedia(type, fields, callback) {

    }

    static deleteMedia(type, fields, callback) {

    }

    static getAll() {
        // insert code that connects the four tablesz
    }

}
