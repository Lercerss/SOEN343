import React from 'react';
import ReactDOM from 'react-dom';
import {
    List,
    Button,
    Card,
    Modal,
    Form,
    Radio,
    Select,
    Input,
    Menu,
    Dropdown,
    Icon,
    Divider
} from 'antd';
import MediaForm from '../MediaForm';
import Criteria from './Criteria';
import { deleteItem, viewItems } from '../../utils/httpUtils';

function compareMediaItems(item, type, other, otherType) {
    return item.id === other.id && type === otherType;
}

export default class ItemsList extends React.Component {
    state = {
        itemList: [],
        isEditFormShown: false,
        editFormMediaType: '',
        itemInfo: undefined,
        catalogSize: 0,
        filters: {},
        order: {}
    };

    componentDidMount() {
        viewItems(this.props.token, 1, { mediaType: null, fields: {} }, {})
            .then(response => {
                this.setState({
                    itemList: response.data.catalog,
                    catalogSize: response.data.size
                });
            })
            .catch(reason => {
                console.debug(reason);
                //workaround not the best way.
                this.setState({ itemList: [] });
            });
    }
    fetchPage = page => {
        viewItems(this.props.token, page, this.state.filters, this.state.order)
            .then(response => {
                this.setState({
                    itemList: response.data.catalog,
                    catalogSize: response.data.size
                });
            })
            .catch(reason => {
                alert(reason);
            });
    };
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
                    itemList: this.state.itemList.filter(
                        el => !compareMediaItems(item.itemInfo, item.type, el.itemInfo, el.type)
                    )
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
        items[
            items.findIndex(el =>
                compareMediaItems(itemInfo, this.state.editFormMediaType, el.itemInfo, el.type)
            )
        ].itemInfo = itemInfo;
        this.setState({
            isEditFormShown: false,
            editFormMediaType: '',
            itemsList: items
        });
        console.log(items);
    };
    handleFilters = filters => {
        console.log(filters);
        filters.mediaType = filters.mediaType ? filters.mediaType : null;
        this.setState({
            filters: filters
        });
        this.fetchPage(1);
    };
    handleOrder = order => {
        console.log(order);
        this.setState({
            order: order
        });
        this.fetchPage(1);
    };
    render() {
        const { token, isAdmin } = this.props;
        const { itemInfo, itemList } = this.state;

        if (!itemList) {
            return <h2>Loading...</h2>;
        }
        return (
            <Card>
                <Criteria onFiltersChanged={this.handleFilters} onOrderChanged={this.handleOrder} />
                <List
                    itemLayout="horizontal"
                    size="small"
                    pagination={{
                        pageSize: 15,
                        onChange: this.fetchPage,
                        total: this.state.catalogSize
                    }}
                    dataSource={this.state.itemList}
                    renderItem={item => (
                        <List.Item
                            key={`${item.itemInfo.title}`}
                            actions={
                                isAdmin
                                    ? [
                                          <Button
                                              onClick={e => this.handleEdit(item)}
                                              type="primary"
                                          >
                                              Edit
                                          </Button>,
                                          <Button
                                              onClick={e => this.handleDelete(item)}
                                              type="primary"
                                          >
                                              Delete
                                          </Button>
                                      ]
                                    : []
                            }
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
                    // Removes default footer
                    footer={null}
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
