import React from 'react';
import { List, Button, Card, Icon } from 'antd';
import MusicForm from '../../MusicForm';
import MovieForm from '../../MovieForm';
import BookForm from '../../BookForm';
import MagazineForm from '../../MagazineForm';
import { deleteItem } from '../../../utils/httpUtils';

export default class ItemsList extends React.Component {
    state = {
        isEditFormShown: false,
        editFormMediaType: undefined,
        itemInfo: undefined
    };

    handleEdit = item => {
        this.setState({
            isEditFormShown: true,
            editFormMediaType: item.type,
            itemInfo: item.itemInfo
        });
        console.log(`TODO: Implement editing media info. \nClicked ${JSON.stringify(item)}`);
    };

    handleDelete = item => {
        deleteItem(item.itemInfo.id, item.itemInfo, this.props.token);
    };

    handleClose = () => {
        this.setState({
            isEditFormShown: false
        });
    };

    render() {
        let formComponent = '';
        const { token, items } = this.props;
        const { itemInfo } = this.state;

        if (this.state.isEditFormShown) {
            if (this.state.editFormMediaType == 'Book')
                formComponent = (
                    <BookForm
                        action="update"
                        token={token}
                        item={itemInfo}
                        handleClose={this.handleClose}
                    />
                );
            else if (this.state.editFormMediaType == 'Magazine')
                formComponent = (
                    <MagazineForm
                        action="update"
                        token={token}
                        item={itemInfo}
                        handleClose={this.handleClose}
                    />
                );
            else if (this.state.editFormMediaType == 'Movie')
                formComponent = (
                    <MovieForm
                        action="update"
                        token={token}
                        item={itemInfo}
                        handleClose={this.handleClose}
                    />
                );
            else if (this.state.editFormMediaType == 'Music')
                formComponent = (
                    <MusicForm
                        action="update"
                        token={token}
                        item={itemInfo}
                        handleClose={this.handleClose}
                    />
                );
        }

        if (!items) {
            return <h2>Loading...</h2>;
        }
        return (
            <Card>
                <List
                    itemLayout="horizontal"
                    size="small"
                    pagination={{
                        pageSize: 50
                    }}
                    dataSource={items}
                    renderItem={item => (
                        <List.Item
                            key={`${item.itemInfo.title}`}
                            actions={[
                                <Button onClick={e => this.handleEdit(item)} type="primary">
                                    Edit
                                </Button>,
                                <Button onClick={e => this.handleDelete(item)} type="primary">
                                    Delete
                                </Button>
                            ]}
                        >
                            <List.Item.Meta
                                title={`${item.itemInfo.title}`}
                                description={<div>{item.type}</div>}
                            />
                        </List.Item>
                    )}
                />
                {this.state.isEditFormShown && (
                    <div className="modal-wrap">
                        <div
                            className="Form_close"
                            onClick={this.handleClose}
                            onKeyPress={this.handleClose}
                            role="button"
                            tabIndex={0}
                        >
                            &#10005;
                        </div>
                        <div className="MetaForm">{formComponent}</div>
                    </div>
                )}
            </Card>
        );
    }
}
