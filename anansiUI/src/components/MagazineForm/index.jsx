import React from 'react';
import { Form, Input, Button, DatePicker } from 'antd';
import { addNewItem, editItem } from '../../utils/httpUtils';

const FormItem = Form.Item;

class MagazineForm extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const { token } = this.props;

                if (this.props.action == "insert") {
                    addNewItem('magazine', values, token)
                        .then(response => {
                            console.log(response);
                        });
                } else if (this.props.action == "update") {
                    addNewItem('magazine', values, token)
                        .then(response => {
                            console.log(response);
                        });
                }
            }
        });
    };

    render() {

        const { getFieldDecorator } = this.props.form;
        const item = this.props.item ? this.props.item : {};

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
            }
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0
                },
                sm: {
                    span: 16,
                    offset: 8
                }
            }
        };

        return (
            <Form onSubmit={this.handleSubmit} className="MagazineForm">
                <FormItem {...formItemLayout} label="Title">
                    {getFieldDecorator('title', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input title'
                            }
                        ],
                        initialValue: item.title
                    })(<Input placeholder="TIME" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Publisher">
                    {getFieldDecorator('publisher', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input publisher'
                            }
                        ],
                        initialValue: item.publisher
                    })(<Input placeholder="Time" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Date of publication">
                    {getFieldDecorator('publicationDate', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input date of publication'
                            }
                        ],
                        initialValue: item.publicationDate
                    })(<DatePicker placeholder="2008-05-13" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Language">
                    {getFieldDecorator('language', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input language'
                            }
                        ],
                        initialValue: item.language
                    })(<Input placeholder="English" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="ISBN-10">
                    {getFieldDecorator('isbn10', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input ISBN-10'
                            },
                            {
                                len: 10,
                                message: "Must be 10 digits long"
                            }
                        ],
                        initialValue: item.isbn10
                    })(<Input placeholder="1603200185" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="ISBN-13">
                    {getFieldDecorator('isbn13', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input ISBN-13'
                            },
                            {
                                len: 13,
                                message: "Must be 13 digits long"
                            }
                        ],
                        initialValue: item.isbn13
                    })(<Input placeholder="9781603200189" />)}
                </FormItem>

                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </FormItem>
            </Form>
        );
    }
}

const WrappedMagazineForm = Form.create()(MagazineForm);
export default WrappedMagazineForm;