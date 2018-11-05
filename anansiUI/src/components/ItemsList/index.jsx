import React from 'react';
import { List, Button, Card, Modal } from 'antd';
import MediaForm from '../MediaForm';
import { deleteItem, viewItems } from '../../utils/httpUtils';

function compareMediaItems(item, type, other, otherType) {
    return item.id === other.id && type === otherType ;
}

export default class ItemsList extends React.Component {
    state = {
        itemList: [],
        isEditFormShown: false,
        editFormMediaType: '',
        itemInfo: undefined
    };
    componentDidMount() {
        viewItems(this.props.token, { mediaType: null, fields: {} }, {})
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
        deleteItem(item.type, item.itemInfo, this.props.token)
            .then(response => {
                this.setState({
                    itemList: this.state.itemList.filter(el => !compareMediaItems(item.itemInfo, item.type, el.itemInfo, el.type))
                });
            })
            .catch(err => {
                // TODO: Handle error when deleting item in backend
                console.log(err);
            });
    };
    handleClose = itemInfo => {
        if (!itemInfo) {
            this.setState({
                isEditFormShown: false,
                editFormMediaType: ''
            });
            return;
        }
        const items = this.state.itemList;
        items[items.findIndex(el => compareMediaItems(itemInfo, this.state.editFormMediaType, el.itemInfo, el.type))].itemInfo = itemInfo;
        this.setState({
            isEditFormShown: false,
            editFormMediaType: '',
            itemsList: items
        });
    };
    render() {
        const { token } = this.props;
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
                    onCancel={e => this.handleClose(null)}
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
