import React from 'react';
import { List, Button, Card, Modal, Row, Col, Icon, Popconfirm } from 'antd';
import MediaForm from '../MediaForm';
import Criteria from './Criteria';
import { deleteItem, viewItems, getLock, releaseLock } from '../../utils/httpUtils';
import MediaDetails from '../MediaDetails';
import EditTimer from '../MediaForm/EditTimer'
import { getMagIssue, getMovieYear } from "../../utils/formatUtils";

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
        filters: { mediaType: null, fields: {} },
        order: {},
        detailsIndex: -1,
        lockedAt: 0
    };

    listStyle = {
        controlBtn: {
            margin: '5px'
        },
        rightAlign: {
            textAlign: 'right'
        }
    };

    componentDidMount() {
        viewItems(1, { mediaType: null, fields: {} }, {})
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
        viewItems(page, this.state.filters, this.state.order)
            .then(response => {
                this.setState({
                    itemList: response.data.catalog,
                    catalogSize: response.data.size,
                    detailsIndex: -1
                });
            })
            .catch(reason => {
                Modal.error({
                    title: 'Error fetching catalog items',
                    content: reason.response.data.message
                });
            });
    };
    handleEdit = item => {
        getLock(item.type, item.itemInfo.id)
            .then(response => {
                this.setState({
                    lockedAt: response.data.lockedAt,
                    isEditFormShown: true,
                    editFormMediaType: item.type,
                    itemInfo: item.itemInfo
                });
            })
            .catch(reason => {
                Modal.error({
                    title: 'Could not edit item',
                    content: reason.response ? reason.response.data.message : 'Connection error'
                });
            });
    };
    handleDelete = item => {
        deleteItem(item.type, item.itemInfo)
            .then(response => {
                this.setState({
                    itemList: this.state.itemList.filter(
                        el => !compareMediaItems(item.itemInfo, item.type, el.itemInfo, el.type)
                    )
                });
                Modal.success({
                    title: 'Item was successfully deleted',
                  });
            })
            .catch(err => {
                Modal.error({
                    title: 'Error deleting item',
                    content: reason.message
                });
                console.log(err);
            });
    };
    handleModalCancel = itemInfo => {
        releaseLock(this.state.editFormMediaType, itemInfo.id);
        this.setState({
            isEditFormShown: false,
            editFormMediaType: ''
        });
    };
    handleClose = itemInfo => {
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
    };
    handleFilters = filters => {
        filters.mediaType = filters.mediaType ? filters.mediaType : null;
        this.setState({ filters: filters }, function() {
            this.fetchPage(1);
        });
    };

    handleType = type => {
        var _fields = {};
        if (typeof this.state.fields !== 'undefined') {
            _fields = this.state.fields;
        }

        this.setState({ filters: { mediaType: type, fields: _fields } }, function() {
            this.fetchPage(1);
        });
    };
    handleOrder = order => {
        this.setState({ order: order }, function() {
            this.fetchPage(1);
        });
    };
    handleDetails = index => {
        this.setState({
            detailsIndex: this.state.detailsIndex === index ? -1 : index
        });
    };

    renderButtons = (item, index) => {
        const { isAdmin, cart, removeItemFromCart, addItemToCart } = this.props;
        const mappedCart = cart.map(function(e) {
            return e.itemInfo.id + e.type;
        });
        const confirmDelete = 'Are you sure to delete this item?'

        if (isAdmin) {
            return (
                <div>
                    <Button
                        key={`Details.${Math.random()}`}
                        onClick={e => this.handleDetails(index)}
                        type="default"
                        style={this.listStyle.controlBtn}
                    >
                        <Icon type="ellipsis" />
                    </Button>
                    <Button
                        key={`Edit.${Math.random()}`}
                        onClick={e => this.handleEdit(item)}
                        type="primary"
                        style={this.listStyle.controlBtn}
                    >
                        Edit
                    </Button>
                    <Popconfirm placement='topRight'
                                title={confirmDelete}
                                okText='Yes'
                                cancelText='Cancel'
                                onConfirm={e => this.handleDelete(item)}
                                icon={<Icon type="warning" style={{ color: 'red' }}/>}
                                >
                        <Button
                            key={`Delete.${Math.random()}`}
                            type="danger"
                            style={this.listStyle.controlBtn}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </div>
            );
        } else if (item.type === 'Magazine') {
            return (
                <div>
                    <Button
                        key={`Details.${Math.random()}`}
                        onClick={e => this.handleDetails(index)}
                        type="default"
                        style={this.listStyle.controlBtn}
                    >
                        <Icon type="ellipsis" />
                    </Button>
                    <Button type="primary" disabled={true} style={this.listStyle.controlBtn}>
                        Cannot Be Loaned
                    </Button>
                </div>
            );
        } else if (mappedCart.includes(item.itemInfo.id + item.type)) {
            return (
                <div>
                    <Button
                        key={`Details.${Math.random()}`}
                        onClick={e => this.handleDetails(index)}
                        type="default"
                        style={this.listStyle.controlBtn}
                    >
                        <Icon type="ellipsis" />
                    </Button>
                    <Button
                        onClick={e => removeItemFromCart(item)}
                        style={this.listStyle.controlBtn}
                    >
                        Remove From Cart
                    </Button>
                </div>
            );
        } else if (item.itemInfo.copies && item.itemInfo.copies.some(copy => copy.available)) {
            return (
                <div>
                    <Button
                        key={`Details.${Math.random()}`}
                        onClick={e => this.handleDetails(index)}
                        type="default"
                        style={this.listStyle.controlBtn}
                    >
                        <Icon type="ellipsis" />
                    </Button>
                    <Button
                        onClick={e => addItemToCart(item)}
                        type="primary"
                        style={this.listStyle.controlBtn}
                    >
                        Add To Cart
                    </Button>
                </div>
            );
        } else {
            return (
                <div>
                    <Button
                        key={`Details.${Math.random()}`}
                        onClick={e => this.handleDetails(index)}
                        type="default"
                        style={this.listStyle.controlBtn}
                    >
                        <Icon type="ellipsis" />
                    </Button>
                    <Button type="primary" disabled={true} style={this.listStyle.controlBtn}>
                        No Copies Available
                    </Button>
                </div>
            );
        }
    };

    selectOriginator = (mediaType, item) =>{
        var magIssue = getMagIssue(item.publicationDate);
        var movieYear = getMovieYear(item.releaseDate);

        if (mediaType === 'Book') return ' by ' + item.author;
        else if (mediaType === 'Magazine') return magIssue;
        else if (mediaType === 'Music') return ' by ' + item.artist;
        else if (mediaType === 'Movie') return movieYear;
    }
    render() {
        const { itemInfo, itemList } = this.state;
        const { isAdmin } = this.props;
        if (!itemList) {
            return <h2>Loading...</h2>;
        }

        return (
            <Card>
                <Criteria
                    onMediaTypeClicked={this.handleType}
                    onFiltersChanged={this.handleFilters}
                    onOrderChanged={this.handleOrder}
                />
                <List
                    itemLayout="vertical"
                    size="small"
                    pagination={{
                        pageSize: 15,
                        onChange: this.fetchPage,
                        total: this.state.catalogSize
                    }}
                    dataSource={this.state.itemList}
                    renderItem={(item, index) => (
                        <List.Item key={`${item.itemInfo.type}.${item.itemInfo.id}`}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <List.Item.Meta
                                        title={`${item.itemInfo.title}`}
                                        description={
                                        <div>
                                            {item.type}, {this.selectOriginator(item.type, item.itemInfo)}
                                        </div>
                                        }
                                    />
                                </Col>
                                <Col span={12} style={this.listStyle.rightAlign}>
                                    {this.renderButtons(item, index)}
                                </Col>
                            </Row>

                            <MediaDetails
                                isAdmin={isAdmin}
                                item={item}
                                visible={this.state.detailsIndex === index}
                            />
                        </List.Item>
                    )}
                />
                <Modal
                    visible={this.state.isEditFormShown}
                    title={
                        <Row>
                            <Col span="12">Edit Item</Col>
                            <Col span="12">
                                <EditTimer
                                    lockedAt={this.state.lockedAt}
                                    isEditFormShown={this.state.isEditFormShown}
                                    style={this.listStyle.rightAlign}
                                />
                            </Col>
                        </Row>
                    }
                    onCancel={e => this.handleModalCancel(itemInfo)}
                    footer={null}
                >
                    <div className="MetaForm">
                        <MediaForm
                            type={this.state.editFormMediaType}
                            action="update"
                            item={itemInfo}
                            handleClose={this.handleClose}
                        />
                    </div>
                </Modal>
            </Card>
        );
    }
}
