import React from 'react';
import { Form, Input, Button, DatePicker, Card } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;

class MagazineForm extends React.Component {
    handleAdd = () => {
        const { form } = this.props;
        const copyIds = form.getFieldValue('copyIds') || [];
        const newCopyIds = copyIds.concat((Math.min(...copyIds, 0)) - 1);
        form.setFieldsValue({
            copyIds: newCopyIds
        });
    }
    handleDelete = (copy) => {
        const { form } = this.props;
        const copyIds = form.getFieldValue('copyIds');
        form.setFieldsValue({
            copyIds: copyIds.filter(el => el !== copy)
        });
    }
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const item = this.props.item || {};

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
        getFieldDecorator('copyIds', {initialValue: item.copyIds || []});
        return (
            <Form onSubmit={(e) => this.props.handleSubmit(e, this.props.form)} className="Form">
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
                        initialValue: moment(item.publicationDate)
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
                                message: 'Must be 10 digits long'
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
                                message: 'Must be 13 digits long'
                            }
                        ],
                        initialValue: item.isbn13
                    })(<Input placeholder="9781603200189" />)}
                </FormItem>

                <Card>
                    {getFieldValue('copyIds').map((copy, index) => {
                        return (
                            <FormItem key={copy} {...formItemLayout}>
                                {getFieldDecorator(`copyNames[${copy}]`, {
                                    rules: [
                                        {
                                            required: true,
                                            whitespace: true,
                                            message: 'Input a non-empty identifier or delete this copy'
                                        }
                                    ],
                                    initialValue: item.copyNames && item.copyNames[copy]
                                })(<Input placeholder="Copy identifier" style={{ width: '80%', marginRight: 8 }}/>)}
                                <Button type="default" onClick={()=>this.handleDelete(copy)}>-</Button>
                            </FormItem>
                        );
                    })}
                    <Button type="default" onClick={this.handleAdd}>Add copy</Button>
                </Card>

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
