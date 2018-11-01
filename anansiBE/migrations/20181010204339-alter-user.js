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
    return db.renameTable('user', 'users').then(result => {
        db.runSql('DELETE FROM users WHERE username=?;', ['tester'], err => {
            if (err) throw err;
            db.insert(
                'users',
                ['username', 'password', 'firstName', 'lastName', 'email', 'address', 'phoneNumber', 'isAdmin'],
                ['tester', '$2a$10$xXCCNFAH7srbDCROBzLbpuP8nrMIotQCZa/g5RrAHkd11YZH/vKri', 'chirac', 'alvyn', 'test@test.te', 'tester drive', '413-80085', 1],
                err => { if (err) throw err; }
            );
        });
    }).catch(err => {
        if (err) throw err;
    });
};

exports.down = function(db) {
    return db.renameTable('users', 'user');
};

exports._meta = {
    'version': 1
};
