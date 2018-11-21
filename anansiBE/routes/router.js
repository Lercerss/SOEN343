import express from 'express';
import { loginUser, logoutUser, displayUsers, validateUser, createUser, displayUserProfile } from './userRoute';
import { displayItems, addItem, editItem, deleteItem, loanCopies, getLoans, returnCopies } from './catalogRoute';
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
router.route('/user/logout').post(logoutUser);
router.route('/user/display-all').get(displayUsers);
router.route('/user/validate').get(validateUser);
router.route('/user/create').post(createUser);
router.route('/user/profile/:username').get(displayUserProfile);
router.route('/item/display').post(displayItems);
router.route('/item/add').post(addItem);
router.route('/item/edit').post(editItem);
router.route('/item/delete').delete(deleteItem);
router.route('/item/loan').post(loanCopies);
router.route('/item/get-loans').post(getLoans);
router.route('/item/return').post(returnCopies);

export { router, validateToken };
