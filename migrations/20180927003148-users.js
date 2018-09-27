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
    return db.createTable('user',
        {
            client_id: { type: 'int', primaryKey: true, autoIncrement: true },
            username: 'string',
            password: 'string',
            firstName: 'string',
            lastName: 'string',
            email: 'string',
            address: 'string',
            phoneNumber: 'string',
            isAdmin: 'boolean',
            timestamp: 'datetime',
        }
    ).then(
        function(result) {
            db.dropTable('test');
        },
        function(err) {
            if (err) throw err;
        }
    );
};

exports.down = function(db) {
    return db.dropTable('user');
};

exports._meta = {
    'version': 1
};
