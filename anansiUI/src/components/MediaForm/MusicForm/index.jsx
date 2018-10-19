import React from 'react';
import { Form, Input, Button, DatePicker, Radio } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

class MusicForm extends React.Component {
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
            <Form onSubmit={(e) => this.props.handleSubmit(e, this.props.form)} className="Form">
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
                    })(<Input placeholder="B008FOB124" disabled={this.props.action == 'update'} />)}
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

const WrappedMusicForm = Form.create()(MusicForm);
export default WrappedMusicForm;
