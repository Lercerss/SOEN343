import React from 'react';
import { Form, Card, Dropdown, Radio, Divider, Input, Select, Button, Menu, Icon } from 'antd';

const mediaData = {
    all: ['title'],
    book: ['title', 'author', 'format', 'pages', 'publisher', 'isbn10', 'isbn13', 'publicationDate', 'language'],
    magazine: ['title', 'publisher', 'language', 'isbn10', 'isbn13', 'publicationDate'],
    movie: ['title', 'director', 'producers', 'actors', 'language', 'subtitles', 'dubbed', 'runTime', 'releaseDate'],
    music: ['title', 'type', 'artist', 'label', 'asin', 'releaseDate']
};

class Criteria extends React.Component {
    state = {
        filterType: '',
        dropdownOptions: mediaData.all,
        selectedOptions: [],
        searchBy: 'title',
        order: 'asc'
    };
    addInput = key => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(key);
        form.setFieldsValue({
            keys: nextKeys
        });
    };
    removeInput = k => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        form.setFieldsValue({
            keys: keys.filter(key => key !== k)
        });
    };
    handleView = e => {
        const val = e.target.value;
        // set the state to filter type

        this.setState({ filterType: val }, 
            function(){ if (val !== '') {
                this.setState({ dropdownOptions: mediaData[val.toLocaleLowerCase()].sort() });
            } else {
                this.setState({ dropdownOptions: mediaData.all });
            } 

            this.props.form.resetFields(['fields', 'inputs', 'keys']);

            this.setState( { searchBy: "title"});
            this.forceUpdate();    
        });
    };
    handleSearch = e => {
        e.preventDefault();
        const { form } = this.props;
        const values = form.getFieldsValue();
        const filters = values.fields
            .filter(field => field)
            .map(field => [field, values.inputs[field]])
            .reduce((acc, cur) => {
                return { ...acc, [cur[0]]: cur[1] };
            }, {});
        let criteria = {
            mediaType: this.state.filterType,
            fields: filters
        };
        this.props.onFiltersChanged(criteria);
    };
    handleFieldsMenu = e => {
        const newVal = this.state.dropdownOptions[e.key];
        this.setState({
            searchBy: newVal
        })
        this.notifyOrderChanged(newVal, this.state.order);
    };
    handleOrderMenu = e => {
        const newVal = e.key === "0" ? 'ASC' : 'DESC';
        console.log(newVal);
        this.setState({
            order: newVal
        })
        this.notifyOrderChanged(this.state.searchBy, newVal);
    }
    notifyOrderChanged = (searchBy, order) => {
        this.props.onOrderChanged({[searchBy]: order})
    }
    handleSelect = values => {
        const prev = this.state.selectedOptions;
        this.setState({
            selectedOptions: values
        });
        const delKey = prev.filter(el => !values.includes(el));
        const newKey = values.filter(el => !prev.includes(el));
        if (newKey.length) {
            this.addInput(newKey[0]);
        }
        if (delKey.length) {
            this.removeInput(delKey[0]);
        }
    };

    handleType = e => {
        var val = e.target.value;
        console.log(val);
        this.notifyMediaTypeChanged(val);
    }

    notifyMediaTypeChanged = (mediaType) => {
        this.props.onMediaTypeClicked(mediaType);
    }

    render() {
        const { dropdownOptions } = this.state;
        const orderMenu = (
            <Menu onClick={this.handleOrderMenu}>
                <Menu.Item key="0">Ascending Order</Menu.Item>
                <Menu.Item key="1">Descending Order</Menu.Item>
            </Menu>
        );
        const fieldsMenu = (
            <Menu onClick={this.handleFieldsMenu}>
                {this.state.dropdownOptions.map((option, index) => {
                    return <Menu.Item key={index}>{option}</Menu.Item>
                })}
            </Menu>
        );
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 }
            }
        };
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => {
            return (
                <div key={`search${index}`}>
                    <Form.Item {...formItemLayout} required={false} key={`inputs${k}`} label={k}>
                        {getFieldDecorator(`inputs[${k}]`, {
                            validateTrigger: ['onChange', 'onBlur'],
                            rules: [
                                {
                                    required: true,
                                    whitespace: true,
                                    message: 'Please input or delete this field.'
                                }
                            ]
                        })(<Input placeholder="Search..." />)}
                    </Form.Item>
                </div>
            );
        });
        return (
            <div>
                <div align="right">
                    <Dropdown overlay={fieldsMenu} trigger={["click"]}>
                        <a className="ant-dropdown-link" href="#">
                            Sort Results by: {` ${this.state.searchBy}`} <Icon type="down" />
                        </a>
                    </Dropdown>


                    <Dropdown overlay={orderMenu} trigger={["click"]}>
                        <a className="ant-dropdown-link" href="#">
                            Order: {`  ${this.state.order}`} <Icon type="down" />
                        </a>
                    </Dropdown>
                </div>
                <div>
                    <b>Pick a media type : </b>
                    <Radio.Group {...formItemLayout} buttonStyle="solid" onChange={this.handleView}  defaultValue="">
                        <Radio.Button onClick={this.handleType} value="">All</Radio.Button>
                        <Radio.Button onClick={this.handleType} value="Book">Book</Radio.Button>
                        <Radio.Button onClick={this.handleType} value="Magazine">Magazine</Radio.Button>
                        <Radio.Button onClick={this.handleType} value="Movie">Movie</Radio.Button>
                        <Radio.Button onClick={this.handleType} value="Music">Music</Radio.Button>
                    </Radio.Group>
                    <Divider />
                </div>
                <Form onSubmit={this.handleSearch}>
                    <Form.Item label={'Field'} required={false} key={`fields`}>
                        {getFieldDecorator(`fields`, {
                            validateTrigger: ['onChange', 'onBlur']
                        })(
                            <Select placeholder="Please select" mode="multiple" onChange={this.handleSelect}>
                                {dropdownOptions.map(mediaData => (
                                    <Select.Option value={mediaData} key={mediaData}>
                                        {mediaData}
                                    </Select.Option>
                                ))}
                            </Select>
                        )}
                    </Form.Item>
                    {formItems}
                    <Form.Item {...formItemLayout} key="util">
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
                <Divider />
            </div>
        );
    }
}

const WrappedCriteria = Form.create()(Criteria);
export default WrappedCriteria;
