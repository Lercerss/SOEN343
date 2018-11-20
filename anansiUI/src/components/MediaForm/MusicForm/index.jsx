import React from 'react';
import { Form, Input, Button, DatePicker, Radio, Card } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

class MusicForm extends React.Component {
    deleted = [];
    handleAdd = () => {
        const { form } = this.props;
        const copyIds = form.getFieldValue('copyIds') || [];
        const newCopyIds = copyIds.concat(Math.min(...copyIds, 0) - 1);
        form.setFieldsValue({
            copyIds: newCopyIds
        });
    };
    handleDelete = copy => {
        const { form } = this.props;
        const copyIds = form.getFieldValue('copyIds');
        const { [copy]: _, ...copies } = form.getFieldValue('copies');
        if (copy >= 0) {
            this.deleted.push(copy);
        }
        form.setFieldsValue({
            copyIds: copyIds.filter(el => el !== copy),
            copies: copies
        });
    };
    validateCopyName = (_, value, callback) => {
        if (!value) {
            return callback();
        }
        const copyNames = Object.entries(this.props.form.getFieldValue('copies'))
            .filter(pair => pair[0])
            .map(pair => pair[1]);
        let err = undefined;
        if (copyNames.filter(name => name === value).length > 1) {
            err = new Error('Duplicate copy name');
        }
        callback(err);
    };
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
        getFieldDecorator('copyIds', {
            initialValue: (item.copies && item.copies.map(e => e.id)) || []
        });
        return (
            <Form onSubmit={e => this.props.handleSubmit(e, this.props.form, this.deleted)} className="Form">
                <FormItem {...formItemLayout} label="Type">
                    {getFieldDecorator('type', {
                        rules: [
                            {
                                required: true,
                                message: 'Please select type'
                            }
                        ],
                        initialValue: item.type
                    })(
                        <RadioGroup>
                            <RadioButton value="cd">CD</RadioButton>
                            <RadioButton value="vinyl">Vinyl</RadioButton>
                            <RadioButton value="casette">Cassette</RadioButton>
                        </RadioGroup>
                    )}
                </FormItem>

                <FormItem {...formItemLayout} label="Title">
                    {getFieldDecorator('title', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input title'
                            }
                        ],
                        initialValue: item.title
                    })(<Input placeholder="Anastasis" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Artist">
                    {getFieldDecorator('artist', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input artist'
                            }
                        ],
                        initialValue: item.artist
                    })(<Input placeholder="Dead Can Dance" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Label">
                    {getFieldDecorator('label', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input label'
                            }
                        ],
                        initialValue: item.label
                    })(<Input placeholder="Sony Music" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Release date">
                    {getFieldDecorator('releaseDate', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input release date'
                            }
                        ],
                        initialValue: moment(item.releaseDate)
                    })(<DatePicker placeholder="2012-08-14" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="ASIN">
                    {getFieldDecorator('asin', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input ASIN'
                            },
                            {
                                len: 10,
                                message: 'Must be 10 characters long'
                            }
                        ],
                        initialValue: item.asin
                    })(<Input placeholder="B008FOB124" />)}
                </FormItem>

                <Card title="Music Copies">
                    {getFieldValue('copyIds').map((copy, index) => {
                        return (
                            <FormItem key={copy} {...formItemLayout}>
                                {getFieldDecorator(`copies[${copy}]`, {
                                    rules: [
                                        {
                                            required: true,
                                            whitespace: true,
                                            message: 'Input a non-empty identifier or delete this copy'
                                        },
                                        {
                                            validator: this.validateCopyName
                                        }
                                    ],
                                    validateTrigger: ['onBlur'],
                                    initialValue: item.copies && (item.copies.find(el => el.id === copy)|| {}).name
                                })(<Input placeholder="Copy identifier" style={{ width: '80%', marginRight: 8 }} />)}
                                <Button type="default" onClick={() => this.handleDelete(copy)}>
                                    -
                                </Button>
                            </FormItem>
                        );
                    })}
                    <Button type="default" onClick={this.handleAdd}>
                        Add copy
                    </Button>
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

const WrappedMusicForm = Form.create()(MusicForm);
export default WrappedMusicForm;
