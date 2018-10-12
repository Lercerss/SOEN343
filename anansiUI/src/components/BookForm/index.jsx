import React from 'react';
import { Form, Input, Button, Radio, InputNumber, DatePicker } from 'antd';
import { addNewItem, editItem } from '../../utils/httpUtils';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

class BookForm extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const { token } = this.props;

                if (this.props.action == 'insert') {
                    addNewItem('Book', values, token).then(response => {
                        console.log(response);
                    });
                } else if (this.props.action == 'update') {
                    editItem('Book', values, token).then(response => {
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
            <Form onSubmit={this.handleSubmit} className="BookForm">
                <FormItem {...formItemLayout} label="Title">
                    {getFieldDecorator('title', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input title'
                            }
                        ],
                        initialValue: item.title
                    })(<Input placeholder="Do Androids Dream of Electric Sheep?" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Author">
                    {getFieldDecorator('author', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input author name'
                            }
                        ],
                        initialValue: item.author
                    })(<Input placeholder="Philip K. Dick" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Format">
                    {getFieldDecorator('format', {
                        rules: [
                            {
                                required: true,
                                message: 'Please select format'
                            }
                        ],
                        initialValue: item.format
                    })(
                        <RadioGroup>
                            <RadioButton value="paperback">Paperback</RadioButton>
                            <RadioButton value="hardcover">Hardcover</RadioButton>
                        </RadioGroup>
                    )}
                </FormItem>

                <FormItem {...formItemLayout} label="Number of Pages">
                    {getFieldDecorator('pages', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input number of pages'
                            },
                            {
                                type: 'integer',
                                message: 'Please input an integer'
                            }
                        ],
                        initialValue: item.pages
                    })(<InputNumber placeholder="240" />)}
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
                    })(<Input placeholder="Del Rey" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Publication date">
                    {getFieldDecorator('publicationDate', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input publication date'
                            }
                        ],
                        initialValue: item.publicationDate
                    })(<DatePicker placeholder="2017-09-26" />)}
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
                                message: 'Must be 10 digits long'
                            }
                        ],
                        initialValue: item.isbn10
                    })(<Input placeholder="1524796972" />)}
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
                                message: 'Must be 13 digits long'
                            }
                        ],
                        initialValue: item.isbn13
                    })(<Input placeholder="9781524796976" />)}
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

const WrappedBookForm = Form.create()(BookForm);
export default WrappedBookForm;
