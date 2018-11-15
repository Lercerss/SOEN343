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
    db.addForeignKey('books', 'users', 'locked_by_id', { 'id': 'client_id' }, {
        onDelete: 'NO ACTION',
        onUpdate: 'RESTRICT',
    }
    );
    db.addForeignKey('magazines', 'users', 'locked_by_id', { 'id': 'client_id' }, {
        onDelete: 'NO ACTION',
        onUpdate: 'RESTRICT',
    }
    );
    db.addForeignKey('movies', 'users', 'locked_by_id', { 'id': 'client_id' }, {
        onDelete: 'NO ACTION',
        onUpdate: 'RESTRICT',
    }
    );
    db.addForeignKey('music', 'users', 'locked_by_id', { 'id': 'client_id' }, {
        onDelete: 'NO ACTION',
        onUpdate: 'RESTRICT',
    }
    );
    db.addColumn('books', 'locked_at', { type: 'datetime', defaultValue: null });
    db.addColumn('magazines', 'locked_at', { type: 'datetime', defaultValue: null });
    db.addColumn('movies', 'locked_at', { type: 'datetime', defaultValue: null });
    db.addColumn('music', 'locked_at', { type: 'datetime', defaultValue: null });
    return null;
};

exports.down = function(db) {
    db.removeForeignKey('books', 'locked_by_id');
    db.removeForeignKey('magazines', 'locked_by_id');
    db.removeForeignKey('movies', 'locked_by_id');
    db.removeForeignKey('music', 'locked_by_id');
    db.removeColumn('music', 'locked_at');
    db.removeColumn('movies', 'locked_at');
    db.removeColumn('magazines', 'locked_at');
    db.removeColumn('books', 'locked_at');
    return null;
};

exports._meta = {
    'version': 1
};
