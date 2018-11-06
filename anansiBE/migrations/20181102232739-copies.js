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

function createCopiesTable(db, tableSingular, callback) {
    const tableName = tableSingular === 'music' ? tableSingular : tableSingular + 's';
    return db.createTable(
        tableSingular + '_copies',
        {
            id: {
                type: 'int',
                primaryKey: true,
                autoIncrement: true
            },
            [tableSingular + '_id']: {
                type: 'int',
                notNull: true,
                foreignKey: {
                    name: tableSingular + '_copies_fk',
                    table: tableName,
                    rules: {
                        onDelete: 'CASCADE'
                    },
                    mapping: 'id'
                }
            },
            name: 'string'
        },
        err => {
            if (err) throw err;
            // Populate with default of 1 copy per row in description table
            db.runSql(`INSERT INTO ${tableSingular}_copies (${tableSingular}_id) SELECT id FROM ${tableName};`, err => {
                callback(err);
            });
        }
    );
}

exports.up = function(db) {
    createCopiesTable(db, 'book', err => {
        if (err) throw err;
    });
    createCopiesTable(db, 'magazine', err => {
        if (err) throw err;
    });
    createCopiesTable(db, 'movie', err => {
        if (err) throw err;
    });
    return createCopiesTable(db, 'music', err => {
        if (err) throw err;
    });
};

exports.down = function(db) {
    return db.dropTable('book_copies', { ifExists: true }, err => {
        if (err) throw err;
        db.dropTable('magazine_copies', { ifExists: true }, err => {
            if (err) throw err;
            db.dropTable('movie_copies', { ifExists: true }, err => {
                if (err) throw err;
                db.dropTable('music_copies', { ifExists: true });
            });
        });
    });
};

exports._meta = {
    version: 1
};
