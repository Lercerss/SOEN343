import express from 'express';
import { loginUser, displayUsers, validateUser, createUser } from './userRoute';
import { displayItems, addItem, editItem, deleteItem } from './catalogRoute';
import { verifyToken } from '../utils/Auth';

var router = express.Router();
const validateToken = (token, res, callback) => {
    verifyToken(token, (err, decoded) => {
        if (err) {
            console.log(err);
            res.status(401).send({
                message: 'Token is expired or invalid'
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

router.route('/user/login').post(loginUser);
router.route('/user/display-all').post(displayUsers);
router.route('/user/validate').post(validateUser);
router.route('/user/create').post(createUser);
router.route('/item/display-all').post(displayItems);
router.route('/item/add').post(addItem);
router.route('/item/edit').post(editItem);
router.route('/item/delete').delete(deleteItem);

export { router, validateToken };
