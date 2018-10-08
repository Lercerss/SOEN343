import jwt from 'jsonwebtoken';

const secretKey = process.env.SECRETKEY;
export function createToken(user) {
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
}
export function verifyToken(token, callback) {
    // Validates jwt
    jwt.verify(token, secretKey, callback);
}
