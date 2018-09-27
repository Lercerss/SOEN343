var jwt = require('jsonwebtoken');
var hidden = require('../hidden');

let secretKey = hidden.secretKey;

module.exports = {
    createToken: function (user) {
        let tokenData = {
            client_id: user.client_id,
            isAdmin: user.isAdmin
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
    verifyToken: function (token) {
        jwt.verify(token, secretKey, (err, decodedToken) => {
            if (err || !decodedToken) {
                throw new Error('Token was invalid');
            }
            console.log(decodedToken);
        });
    }
};
