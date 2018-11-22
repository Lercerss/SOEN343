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

export default class MediaForm extends React.Component {
    handleSubmit = (e, form, deleted) => {
        e.preventDefault();
        form.validateFieldsAndScroll(undefined, {force: true}, (err, values) => {
            if (err) {
                return;
            }
            const { handleClose, item, action } = this.props;
            const copies = mergeCopies(values.copies, deleted);
            const requestData = { ...values, id: item && item.id, copies: copies };
            console.log('Received values of form: ', requestData);
            const request = action == 'insert' ? addNewItem : action == 'update' ? editItem : null;
            if (request) {
                request(this.props.type, requestData)
                    .then(response => {
                        console.log(response);
                        Modal.success({
                            title: `${requestData.title} has been saved.`
                        });
                        if (handleClose) {
                            const { copies, ...newItem } = requestData;
                            newItem.copies = response.data ? response.data.copies : copies.filter(copy => copy.name);
                            handleClose(newItem);
                        }
                    })
                    .catch(err => {
                        if (err.response.status !== 401) {
                            Modal.error({
                                title: `Failed to add new ${type}`,
                                content: err.response ? err.response.data.message : 'Connection error'
                            });
                        }
                        console.log(err);
                    });
            }
        });
    };
    render() {
        const styles = {
            formItemLayout: {
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: this.props.action === 'insert' ? 6 : 8  }
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { 
                        span: this.props.action === 'insert' ? 14 : 12,
                        offset: 1,    
                    }
                }
            }, 
            tailFormItemLayout: {
                wrapperCol: {
                    xs: {
                        span: 24,
                        offset: 0
                    },
                    sm: {
                        span:  24,
                        offset: 0
                    }
                }
            },
            centerButton: {
                textAlign: 'center',
                paddingTop: '10px',

            }
        }
        const { type, ...props } = this.props;
        let formComponent = '';
        props.handleSubmit = this.handleSubmit;
        if (type == 'Book') formComponent = <BookForm {...props} styles={styles} />;
        else if (type == 'Magazine') formComponent = <MagazineForm {...props} styles={styles}/>;
        else if (type == 'Movie') formComponent = <MovieForm {...props} styles={styles}/>;
        else if (type == 'Music') formComponent = <MusicForm {...props} styles={styles}/>;
        return formComponent;
    }
}
