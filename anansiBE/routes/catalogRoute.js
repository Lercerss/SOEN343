import { Catalog } from '../models/Catalog';
import { validateToken } from './router';

export function displayItems(req, res) {
    validateToken(req.get('Authorization').split(' ')[1], res, decoded => {
        if (!decoded.data.client_id) {
            return;
        }
        Catalog.viewItems(req.body.nPage, req.body.filters, req.body.ordering, (err, catalog, size) => {
            if (err){
                if (err.message.includes('database')){
                    res.status(500).send({
                        message: err.message,
                        error: err
                    });
                    return;
                } else if (err.message.includes('media')){
                    res.status(400).send({
                        message: err.message,
                        error: err
                    });
                    return;
                }
            }
            let typedCatalog = catalog.map(val => {
                return {
                    itemInfo: val,
                    type: val.constructor.name
                };
            });
            let response = {
                catalog: typedCatalog,
                size: size
            };
            res.status(200).send(response);
        });
    });
}

export function loanCopies(req, res) {
    validateToken(req.get('Authorization').split(' ')[1], res, decoded => {
        if (!decoded.data.client_id) {
            return;
        }

        Catalog.loanCopies(req.body.items, decoded.data.client_id, err => {
            if (err) {
                console.log(err);
                res.status(500).send({
                    message: 'Could not loan item',
                    error: err
                });
                return;
            }
            res.status(200).send({
                message: 'Items were loaned'
            });
        });
    });
}

export function addItem(req, res) {
    validateToken(req.get('Authorization').split(' ')[1], res, decoded => {
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
}

export function editItem(req, res) {
    validateToken(req.get('Authorization').split(' ')[1], res, decoded => {
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
}

export function deleteItem(req, res) {
    validateToken(req.get('Authorization').split(' ')[1], res, decoded => {
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
                    message: 'Item was deleted'
                });
            });
        }
    });
}
