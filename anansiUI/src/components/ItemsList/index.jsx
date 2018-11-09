import React from 'react';
import ReactDOM from 'react-dom';
import { List, Button, Card, Modal, Form, Radio, Select, Input, Menu, Dropdown, Icon } from 'antd';
import MediaForm from '../MediaForm';
import { deleteItem, viewItems } from '../../utils/httpUtils';



class ItemsList extends React.Component {
    state = {
        itemList: [],
        searchList: [],
        isEditFormShown: false,
        editFormMediaType: '',
        itemInfo: undefined,
        filterType: "",
        dropdownOptions: [],
        searchBy: "",
        visible: false,
        catalogSize: 0
    };

    componentDidMount() {
        viewItems(this.props.token, 1, { mediaType: null, fields: {} }, {})
            .then(response => {
                const b = response.data.hasOwnProperty("message");
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
    fetchPage = (page, pageSize) => {
        viewItems(this.props.token, page, 1, { mediaType: null, fields: {} }, {})
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
        items[
            items.findIndex(
                el => el.itemInfo.id === item.id && el.type == this.state.editFormMediaType
            )
        ].itemInfo = item;
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

        // Sorting 

        const sortAscending = (a, b) => {
            return a - b;
        }
        const sortDescending = (a, b) => {
            return b - a;
        }

        //Sort modifies array, creating a shallow copy

        function sortData() {
            if (this.state.sortDirection === 'descending') {
                this.setState({
                    sortDirection: 'ascending',
                    data: this.props.itemList.slice().sort(sortAscending)
                });
            } else {
                this.setState({
                    sortDirection: 'descending',
                    data: this.props.itemList.slice().sort(sortDescending)
                });
            }
        };

        ///////

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

    handleRemove = (k) => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 0) {
          return;
        }
    
        // can use data-binding to set
        form.setFieldsValue({
          keys: keys.filter(key => key !== k),
        });
      }
    
      handleAdd = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(keys.length);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
          keys: nextKeys,
        });
      }
        
    // Dropdown menu for Sorting

    handleMenuClick = (e) => {
        if (e.key === '3') {
            this.setState({ visible: false });
        }
    }

    handleVisibleChange = (flag) => {
        this.setState({ visible: flag });
    }

    render() {
        const menu = (
            <Menu onClick={this.handleMenuClick}>
                <Menu.Item key="1">Ascending Order (A-Z)</Menu.Item>
                <Menu.Item key="2">Descending Order (Z-A)</Menu.Item>
            </Menu>
        );
        const { token } = this.props;
        const { itemInfo, itemList, dropdownOptions } = this.state;
        const { getFieldDecorator, getFieldValue } = this.props.form;
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
        getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k, index) => {
      return (
        <Form.Item
          label={'Field'}
          required={false}
          key={k}
        >
        <Select placeholder="Please select" onChange={this.handleOption} >
            {dropdownOptions.map(mediaData => <Select.Option value={mediaData} key={mediaData}>{mediaData}</Select.Option>)}
        </Select>
            <Input placeholder="Search..." />
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              onClick={() => this.handleRemove(k)}
            />
         
        </Form.Item>
      );
    });

        if (!itemList) {
            return <h2>Loading...</h2>;
        }
        return (
            <Card>
                <div align="right"><Dropdown overlay={menu}
                onVisibleChange={this.handleVisibleChange}
                visible={this.state.visible}
                >
                <a className="ant-dropdown-link" href="#">
                    Sort Results by: <Icon type="down" />
                </a>
                </Dropdown></div>
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
                        <Input type="text" placeholder="Search Fields" />
                        {formItems}

                        <Button type="dashed" onClick={this.handleAdd} style={{ width: '60%'}}>
                            <Icon type="plus" /> Add Field
                        </Button>
                    </Form.Item>
                </Form>
                <List
                    itemLayout="horizontal"
                    size="small"
                    pagination={{
                        pageSize: 15,
                        onChange: this.fetchPage,
                        total: this.state.catalogSize
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
            </Card >
        
        );



    };
}
const WrappedItemsList = Form.create()(ItemsList);
export default WrappedItemsList;
