import { Catalog } from '../models/Catalog';
import { validateToken } from './router';

export function displayItems(req, res) {
    var catalog = Catalog.viewItems();
    if (catalog.length === 0) {
        res.status(200).send({
            message: 'Catalog is empty'
        });
    } else {
        var typedCatalog = catalog.map(val => {
            return {
                itemInfo: val,
                type: val.constructor.name
            };
        });
        res.status(200).send(typedCatalog);
    }
};

export function addItem(req, res) {
    validateToken(req.body.token, res, decoded => {
        if (!decoded.data.isAdmin) {
            console.log(decoded);
            res.status(403).send({
                message: 'Only administrators can add media items'
            });
        } else {
            Catalog.addItem(req.body.type, req.body.itemInfo, (err, item) => {
                if (item) {
                    console.log(item);
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

                res.status(200).send();
            });
        }
    });
};

export function editItem(req, res) {
    validateToken(req.body.token, res, decoded => {
        if (!decoded.data.isAdmin) {
            console.log(decoded);
            res.status(403).send({
                message: 'Only administrators can add media items'
            });
        } else {
            Catalog.editItem(req.body.type, req.body.itemInfo, (err, item) => {
                if (err) {
                    console.log(err);
                    res.status(500).send({
                        message: 'Could not edit item',
                        error: err
                    });
                }
                if (item == null) {
                    console.log(err);
                    res.status(400).send({
                        message: 'Item could not be found',
                        error: err
                    });
                }
                res.status(200).send();
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
            Catalog.deleteItem(req.body.itemInfo.id, err => {
                if (err) {
                    console.log(err);
                    res.status(500).send({
                        message: 'Could not delete item',
                        error: err
                    });
                }
                res.status(200).send({
                    message: 'Item was deleted',
                });
            });
        }
    });
};
