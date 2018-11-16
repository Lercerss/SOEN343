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
    db.addColumn('books', 'locked_by_id', {
        type: 'int',
        foreignKey: {
            name: 'locked_by_id_books_fk',
            table: 'users',
            rules: {
                onDelete: 'NO ACTION'
            },
            mapping: 'client_id'
        },
    }, err => {
        if (err) throw err;
        db.addColumn('books', 'locked_at', { type: 'datetime', defaultValue: null });
    });
    db.addColumn('magazines', 'locked_by_id', {
        type: 'int',
        foreignKey: {
            name: 'locked_by_id_magazines_fk',
            table: 'users',
            rules: {
                onDelete: 'NO ACTION'
            },
            mapping: 'client_id'
        },
    }, err => {
        if (err) throw err;
        db.addColumn('magazines', 'locked_at', { type: 'datetime', defaultValue: null });
    });
    db.addColumn('movies', 'locked_by_id', {
        type: 'int',
        foreignKey: {
            name: 'locked_by_id_movies_fk',
            table: 'users',
            rules: {
                onDelete: 'NO ACTION'
            },
            mapping: 'client_id'
        },
    }, err => {
        if (err) throw err;
        db.addColumn('movies', 'locked_at', { type: 'datetime', defaultValue: null });
    });
    return db.addColumn('music', 'locked_by_id', {
        type: 'int',
        foreignKey: {
            name: 'locked_by_id_music_fk',
            table: 'users',
            rules: {
                onDelete: 'NO ACTION'
            },
            mapping: 'client_id'
        },
    }, err => {
        if (err) throw err;
        db.addColumn('music', 'locked_at', { type: 'datetime', defaultValue: null });
    });
};

exports.down = function(db) {
    db.removeColumn('music', 'locked_at');
    db.removeColumn('movies', 'locked_at');
    db.removeColumn('magazines', 'locked_at');
    db.removeColumn('books', 'locked_at');
    return db.removeForeignKey('books', 'locked_by_id_books_fk', err => {
        if (err) throw err;
        db.removeForeignKey('movies', 'locked_by_id_movies_fk', err => {
            if (err) throw err;
            db.removeForeignKey('music', 'locked_by_id_music_fk', err => {
                if (err) throw err;
                db.removeForeignKey('magazines', 'locked_by_id_magazines_fk', err => {
                    if (err) throw err;
                    db.removeColumn('books', 'locked_by_id');
                    db.removeColumn('magazines', 'locked_by_id');
                    db.removeColumn('movies', 'locked_by_id');
                    db.removeColumn('music', 'locked_by_id');
                });
            });
        });
    });
};

exports._meta = {
    'version': 1
};
