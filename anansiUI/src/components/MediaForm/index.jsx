import React from 'react';
import { Modal } from 'antd';
import BookForm from './BookForm';
import MagazineForm from './MagazineForm';
import MovieForm from './MovieForm';
import MusicForm from './MusicForm';
import { addNewItem, editItem } from '../../utils/httpUtils';

function mergeCopies(initial, deleted) {
    return [
        ...(initial
            ? Object.entries(initial).map(pair => {
                  return { id: pair[0], name: pair[1] };
              })
            : []),
        ...deleted.map(id => {
            return { id: id };
        })
    ];
}

function parseNewCopies(newCopies, oldCopies) {
    const obj = newCopies && oldCopies.filter(copy => copy.name);
    return (
        obj &&
        obj.reduce((acc, cur) => {
            return { ...acc, [cur.id]: cur.name };
        }, {})
    );
}

export default class MediaForm extends React.Component {
    handleSubmit = (e, form, deleted) => {
        e.preventDefault();
        form.validateFieldsAndScroll(undefined, {force: true}, (err, values) => {
            console.log('Received values of form: ', values);
            if (err) {
                return;
            }
            const { token, handleClose, item, action } = this.props;
            const copies = mergeCopies(values.copies, deleted);
            const requestData = { ...values, id: item && item.id, copies: copies };
            const request = action == 'insert' ? addNewItem : action == 'update' ? editItem : null;
            if (request) {
                request(this.props.type, requestData, token)
                    .then(response => {
                        console.log(response);
                        Modal.success({
                            title: `${requestData.title} has been saved.`
                        });
                        if (handleClose) {
                            const { copies, ...newItem } = requestData;
                            newItem.copies = parseNewCopies(response.data && response.data.copies, copies);
                            handleClose(newItem);
                        }
                    })
                    .catch(err => {
                        if (err.response.status !== 401) {
                            Modal.error({
                                title: 'Failed to create a new user',
                                content: err.response ? err.response.data.message : 'Connection error'
                            });
                        }
                        console.log(err);
                    });
            }
        });
    };
    render() {
        const { type, ...props } = this.props;
        let formComponent = '';
        props.handleSubmit = this.handleSubmit;
        if (type == 'Book') formComponent = <BookForm {...props} />;
        else if (type == 'Magazine') formComponent = <MagazineForm {...props} />;
        else if (type == 'Movie') formComponent = <MovieForm {...props} />;
        else if (type == 'Music') formComponent = <MusicForm {...props} />;
        return formComponent;
    }
}
