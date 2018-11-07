import React from 'react';
import { List, Button, Card, Modal, Form, Radio, Select, Input } from 'antd';
import MediaForm from '../MediaForm';
//import MediaFilter from './MediaFilter';   to be modularized into later on
import { deleteItem, viewItems } from '../../utils/httpUtils';



export default class ItemsList extends React.Component {
    state = {
        itemList: [],
        searchList: [],
        isEditFormShown: false,
        editFormMediaType: '',
        itemInfo: undefined,
        filterType: "",
        dropdownOptions: [],
        searchBy: "",
    };

    componentDidMount() {
        viewItems(this.props.token)
            .then(response => {
                const b = response.data.hasOwnProperty("message");
                this.setState({
                    itemList: b ? []:response.data
                });
            })
            .catch(reason => {
                console.debug(reason);
                //workaround not the best way.
                this.setState({ itemList: [] });
            });
    }
    handleEdit = item => {
        this.setState({
            isEditFormShown: true,
            editFormMediaType: item.type,
            itemInfo: item.itemInfo
        });
    }
    handleDelete = item => {
        deleteItem(item.type, item.itemInfo, this.props.token)
            .then(response => {
                this.setState({
                    itemList: this.state.itemList.filter(el => el.itemInfo.id !== item.itemInfo.id)
                });
            })
            .catch(err => {
                // TODO: Handle error when deleting item in backend
                console.log(err);
            });
    }
    handleClose = item => {
        if (!item) {
            this.setState({
                isEditFormShown: false,
                editFormMediaType: ''
            });
            return;
        }
        const items = this.state.itemList;
        items[items.findIndex(el => el.itemInfo.id === item.id && el.type == this.state.editFormMediaType)].itemInfo = item;
        this.setState({
            isEditFormShown: false,
            editFormMediaType: '',
            itemsList: items
        });
        console.log(items);
    }
    handleView = e => {
        const mediaData = {
            common: ['id', 'title'],
            book: ['author', 'format', 'pages', 'publisher', 'isbn10', 'isbn13', 'publicationDate', 'language'],
            magazine: ['publisher', 'language', 'isbn10', 'isbn13', 'publicationDate'],
            movie: ['director', 'producers', 'actors', 'language', 'subtitles', 'dubbed', 'runTime', 'releaseDate'],
            music: ['type', 'artist', 'label', 'asin', 'releaseDate']
        };
        let options = [];
        // set the state to filter type
        this.setState({ filterType: e.target.value });
        // dropdownOptions populate
        if (e.target.value !== "All") {
            const descriptor = Object.getOwnPropertyDescriptor(mediaData, e.target.value.toLocaleLowerCase());
            options = descriptor.value.concat(mediaData.common);
            console.log(options);
            this.setState({ dropdownOptions: options.sort() });
        }
        else {
            // reduce mediaData object to array containing unique strings
            options = Object.values(mediaData)
                .reduce((accumulator, currentValue) => {
                    currentValue.forEach(el => {
                        if (!accumulator.includes(el)) accumulator.push(el);
                    });
                    return accumulator;
                }, mediaData.common);
            console.log(options);
            this.setState({ dropdownOptions: options.sort() })
        }
    }
    // TODO: needs to implement search list later in handlefilter
    handleFilter = () => {
        if (this.state.itemList.length === 0) {
            return this.state.itemList;
        }
        /*Mila-TODO: sort
            Array.sort(fn comparer)

        */
        //could do a length check on searchList
        //if searchlist.length > 0  => use the search list
        //else => use the itemList
        //could use ternary operator? ( expression with condition ? true case : false case)
        return this.state.itemList
            .filter(item => {
                if (this.state.filterType === "All") return true;
                return item.type === this.state.filterType;
            });
    }
    handleSearch = searchText => {
        // 1-get the selected value of the dropdown 
        const selectedDropdown = this.state.searchBy;
        // 2-get this input value  which is parameter searchText
        // 3-wrap in object , where does the order go?  --> sort
        /* suggestion 1: Default ASC, and create checkbox for Desc 
            suggestion 2: dropdown with ASC, DESC, NO ORDER (default)
        */
        let criteria = {
            mediaType: this.state.filterType,
            fields: {}
        }
        // 3.5-define property for each field object 
        const descriptor = Object.create(null);
        /* this creates an object {   
            enumerable: false,
            configurable: false,
            writable: false, 
            value: null
        }*/
        descriptor.value = searchText;
        // the key pair here is { selectedDropdown : searchText}
        // define property for fields dynamically
        Object.defineProperty(criteria.fields, selectedDropdown, descriptor);
        // 4-POST to backend
        //TODO: more search? only 1 atm.
        //suggestion?: have multiple search inputs (idk up to 3?) 
        console.log(criteria);
        // to implement later when sort is implemented, this is the POST to BE
        // getItems(criteria)
        // .then(response => {
        //     this.setState({
        //         searchList: response.data
        //     });
        // })
        // .catch(reason => {
        //     alert(reason);
        // });
    }
    handleOption = value => {
        this.setState({ searchBy: value });
    }

    render() {
        const { token } = this.props;
        const { itemInfo, itemList, dropdownOptions } = this.state;
        const formItemLayout = {
            // from mediaForm  
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
            }
        };
        if (!itemList) {
            return <h2>Loading...</h2>;
        }
        return (
            <Card>
                <Form>
                    <Form.Item {...formItemLayout} label="Pick a media type:">
                        <Radio.Group buttonStyle="solid" onChange={this.handleView}>
                            <Radio.Button value="All">All</Radio.Button>
                            <Radio.Button value="Book">Book</Radio.Button>
                            <Radio.Button value="Magazine">Magazine</Radio.Button>
                            <Radio.Button value="Movie">Movie</Radio.Button>
                            <Radio.Button value="Music">Music</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item {...formItemLayout} label="Search:">
                        <Select placeholder="Please select" onChange={this.handleOption} >
                            {dropdownOptions.map(mediaData => <Select.Option value={mediaData} key={mediaData}>{mediaData}</Select.Option>)}
                        </Select>
                        {/* to implement later for multiple search criteria??? */}
                        <Input type="text" onSearch={this.handleSearch} placeholder="Search..." />
                        <Input type="text" onSearch={this.handleSearch} placeholder="Search..." />
                    </Form.Item>
                    <Form.Item>
                        <Select ></Select>
                    </Form.Item>
                </Form>
                <List
                    itemLayout="horizontal"
                    size="small"
                    pagination={{
                        pageSize: 50
                    }}
                    // TODO: dataSource will need to changed to handleList later when implementing clear search criteria
                    dataSource={this.handleFilter()}
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
                            ]}>
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
                    footer={null}>
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
    };
}