var jwt = require('jsonwebtoken');
var hidden = require('../hidden');

let secretKey = hidden.secretKey;

module.exports = {
    createToken: function(user) {
        // Creates jwt from user object
        let tokenData = {
            client_id: user.client_id,
            isAdmin: user.isAdmin,
            username: user.username
        };
        let token = jwt.sign(
            {
                data: tokenData
            },
            secretKey,
            {
                expiresIn: 3600,
                algorithm: 'HS256'
            }
        );
        return token;
    },
    verifyToken: function(token, callback) {
        // Validates jwt
        jwt.verify(token, secretKey, callback);
    }
};
