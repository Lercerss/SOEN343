import express from 'express';
import { postLogin, postAllUsers, postValidate, postCreateUser } from './route-controllers/validationRouteController';
import { postItems, postAddItem, postEditItem, postDeleteItem } from './route-controllers/catalogRouteController';
import { verifyToken } from '../utils/Auth';

var router = express.Router();
const validateToken = (token, res, callback) => {
    verifyToken(token, (err, decoded) => {
        if (err) {
            console.log(err);
            res.status(500).send({
                message: 'There was an error decrypting token'
            });
        } else if (!decoded) {
            res.status(400).send({
                message: 'Token has expired'
            });
        } else {
            callback(decoded);
        }
    });
};

router.get('/', (req, res) => {
    res.status(200).send({
        message: 'Express server up and running'
    });
});

router.route('/user/login').post(postLogin);
router.route('/user/display-all').post(postAllUsers);
router.route('/user/validate').post(postValidate);
router.route('/user/create').post(postCreateUser);
router.route('/item/display-all').post(postItems);
router.route('/item/add').post(postAddItem);
router.route('/item/edit').post(postEditItem);
router.route('/item/delete').post(postDeleteItem);

export { router, validateToken };
