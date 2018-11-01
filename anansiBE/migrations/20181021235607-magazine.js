'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function(db) {
    return db.createTable('magazines', {
        id: {
            type: 'int',
            primaryKey: true,
            autoIncrement: true
        },
        title: 'string',
        language: 'string',
        isbn10: 'string',
        isbn13: 'string',
        publisher: 'string',
        publicationDate: 'datetime',
    }).catch(err => {
        if (err) throw err;
    });
};

exports.down = function(db) {
    return db.dropTable('magazines', { ifExists: true });
};

exports._meta = {
    'version': 1
};
