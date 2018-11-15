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
    return db.createTable('loans', {
        id: {
            type: 'int',
            primaryKey: true,
            autoIncrement: true
        },
        item_type: 'string',
        copy_id: 'int',
        user_id: {
            type: 'int',
            notNull: true,
            foreignKey: {
                name: 'loans_users_fk',
                table: 'users',
                rules: {
                    onDelete: 'CASCADE'
                },
                mapping: 'client_id'
            }
        },
        loan_ts: 'datetime',
        return_ts: 'datetime'
    }, err => {
        if (err) throw err;
        db.addColumn('book_copies', 'available', { type: 'boolean', defaultValue: 1 });
        db.addColumn('magazine_copies', 'available', { type: 'boolean', defaultValue: 1 });
        db.addColumn('movie_copies', 'available', { type: 'boolean', defaultValue: 1 });
        db.addColumn('music_copies', 'available', { type: 'boolean', defaultValue: 1 });
    });
};

exports.down = function(db) {
    return db.dropTable('loans', { ifExists: true }, err => {
        if (err) throw err;
        db.removeColumn('book_copies', 'available');
        db.removeColumn('magazine_copies', 'available');
        db.removeColumn('movie_copies', 'available');
        db.removeColumn('music_copies', 'available');
    });
};

exports._meta = {
    version: 1
};
