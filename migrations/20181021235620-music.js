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
    return db.createTable('music', {
        music_id: {
            type: 'int',
            primaryKey: true,
            autoIncrement: true
        },
        releaseDate: 'datetime',
        type: 'string',
        artist: 'string',
        label: 'string',
        asin: 'string',
    }).catch(err => {
        if (err) throw err;
    });
};

exports.down = function(db) {
    return db.dropTable('music', { ifExists: true });
};

exports._meta = {
    'version': 1
};
