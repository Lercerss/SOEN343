import { Catalog } from '../models/Catalog';
import { validateToken } from './router';

export function displayItems(req, res) {
    validateToken(req.body.token, res, decoded => {
        if (!decoded.data.client_id){
            return;
        }
        Catalog.viewItems(catalog => {
            if (catalog.length === 0) {
                res.send({
                    message: 'Catalog is empty'
                });
            } else {
                var typedCatalog = catalog.map(val => {
                    return {
                        itemInfo: val,
                        type: val.constructor.name
                    };
                });
                res.send(typedCatalog);
            }
        });
    });
};

export function addItem(req, res) {
    validateToken(req.body.token, res, decoded => {
        if (!decoded.data.isAdmin) {
            console.log(decoded);
            res.status(403).send({
                message: 'Only administrators can add media items'
            });
        } else {
            Catalog.addItem(req.body.type, req.body.itemInfo, (err, result) => {
                if (err && result) {
                    console.log(result);
                    res.status(400).send({
                        message: 'Item already exists',
                        error: err
                    });
                    return;
                }
                if (err) {
                    console.log(err);
                    res.status(500).send({
                        message: 'Could not add item',
                        error: err
                    });
                    return;
                }
                res.status(200).send({
                    copies: result
                });
            });
        }
    });
};

export function editItem(req, res) {
    validateToken(req.body.token, res, decoded => {
        if (!decoded.data.isAdmin) {
            console.log(decoded);
            res.status(403).send({
                message: 'Only administrators can edit media items'
            });
        } else {
            Catalog.editItem(req.body.type, req.body.itemInfo, (err, result) => {
                if (err && !result) {
                    console.log(err);
                    res.status(500).send({
                        message: 'Could not edit item',
                        error: err
                    });
                    return;
                }
                if (err && result) {
                    console.log(err);
                    res.status(400).send({
                        message: err.message,
                        error: err
                    });
                    return;
                }
                res.status(200).send({
                    copies: result
                });
            });
        }
    });
};

export function deleteItem(req, res) {
    validateToken(req.body.token, res, decoded => {
        if (!decoded.data.isAdmin) {
            console.log(decoded);
            res.status(403).send({
                message: 'Only administrators can delete media items'
            });
        } else {
            Catalog.deleteItem(req.body.type, req.body.itemInfo.id, err => {
                if (err) {
                    console.log(err);
                    res.status(500).send({
                        message: 'Could not delete item',
                        error: err
                    });
                    return;
                }
                res.status(200).send({
                    message: 'Item was deleted',
                });
            });
        }
    });
};
