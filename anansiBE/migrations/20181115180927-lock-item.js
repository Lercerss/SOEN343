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
    return db.addColumn('music', 'isLocked', { type: 'boolean', defaultValue: 0 }, err => {
        if (err) throw err;
        db.addColumn('movies', 'isLocked', { type: 'boolean', defaultValue: 0 }, err => {
            if (err) throw err;
            db.addColumn('magazines', 'isLocked', { type: 'boolean', defaultValue: 0 }, err => {
                if (err) throw err;
                db.addColumn('books', 'isLocked', { type: 'boolean', defaultValue: 0 }, err => {
                    if (err) throw err;
                });
            });
        });
    });
};

exports.down = function(db) {
    db.removeColumn('music', 'isLocked');
    db.removeColumn('movies', 'isLocked');
    db.removeColumn('magazines', 'isLocked');
    db.removeColumn('books', 'isLocked');
    return null;
};

exports._meta = {
    'version': 1
};
