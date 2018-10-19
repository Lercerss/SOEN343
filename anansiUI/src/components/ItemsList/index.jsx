import React from 'react';
import { List, Button, Card, Modal } from 'antd';
import MediaForm from '../MediaForm';
import { deleteItem, viewItems } from '../../utils/httpUtils';

export default class ItemsList extends React.Component {
    state = {
        itemList: [],
        isEditFormShown: false,
        editFormMediaType: undefined,
        itemInfo: undefined
    };
    componentDidMount() {
        viewItems()
            .then(response => {
                this.setState({
                    itemList: response.data
                });
            })
            .catch(reason => {
                alert(reason);
            });
    }
    handleEdit = item => {
        this.setState({
            isEditFormShown: true,
            editFormMediaType: item.type,
            itemInfo: item.itemInfo
        });
    };
    handleDelete = item => {
        deleteItem(item.itemInfo.id, item.itemInfo, this.props.token)
        .then(response => {
            this.setState({
                itemList: this.state.itemList.filter(el => el.itemInfo.id !== item.itemInfo.id)
            })
        }).catch(err => {
            // TODO: Handle error when deleting item in backend
            console.log(err)
        });
    };
    handleClose = (item) => {
        if (!item) {
            this.setState({
                isEditFormShown: false
            });
            return;
        }
        const items = this.state.itemList;
        items[items.findIndex(el => el.itemInfo.id === item.id)].itemInfo = item;
        this.setState({
            isEditFormShown: false,
            itemsList: items
        });
    };
    render() {
        const { token} = this.props;
        const { itemInfo, itemList } = this.state;
        if (!itemList) {
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
                    dataSource={itemList}
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
                <Modal
                    visible={this.state.isEditFormShown}
                    title="Edit Item"
                    onCancel={(e) => this.handleClose(null)}
                    footer={null} // Removes default footer
                >
                    <div className="MetaForm">
                        <MediaForm
                            type={this.state.editFormMediaType}
                            action="update"
                            token={token}
                            item={itemInfo}
                            handleClose={this.handleClose}
                        />
                    </div>
                </Modal>
            </Card>
        );
    }
}