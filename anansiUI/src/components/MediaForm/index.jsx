import React from 'react';
import { Modal } from 'antd';
import BookForm from './BookForm';
import MagazineForm from './MagazineForm';
import MovieForm from './MovieForm';
import MusicForm from './MusicForm';
import { addNewItem, editItem } from '../../utils/httpUtils';

export default class MediaForm extends React.Component {
    handleSubmit = (e, form) => {
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                console.log(err);
                return;
            }
            const { token, handleClose, item, action } = this.props;
            if (item) {
                values.id = item.id;
            }
            console.log('Received values of form: ', values);
            const request = action == 'insert' ? addNewItem : action == 'update' ? editItem : null;
            if (request) {
                request(this.props.type, values, token)
                    .then(response => {
                        console.log(response);
                        Modal.success({
                            title: 'Your registration is complete!'
                        });
                        if (handleClose) {
                            handleClose(values);
                        }
                    })
                    .catch(err => {
                        // TODO: Handle error when submitting form to backend
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
