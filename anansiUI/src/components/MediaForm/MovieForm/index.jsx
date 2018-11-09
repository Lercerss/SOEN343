import React from 'react';
import { Form, Input, Button, DatePicker, Tooltip, Icon, InputNumber, Card } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;

class MovieForm extends React.Component {
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
            console.log('deleted' + copy);
            this.deleted.push(copy);
        }
        form.setFieldsValue({
            copyIds: copyIds.filter(el => el !== copy),
            ['copies[' + copy + ']']: undefined
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
            initialValue: (item.copies && Object.keys(item.copies).map(e => parseInt(e))) || []
        });
        return (
            <Form onSubmit={e => this.props.handleSubmit(e, this.props.form, this.deleted)} className="Form">
                <FormItem {...formItemLayout} label="Title">
                    {getFieldDecorator('title', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input title'
                            }
                        ],
                        initialValue: item.title
                    })(<Input placeholder="Until the End of the World" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Director">
                    {getFieldDecorator('director', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input director'
                            }
                        ],
                        initialValue: item.director
                    })(<Input placeholder="Wim Wenders" />)}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label={
                        <span>
                            Producers&nbsp;
                            <Tooltip title="Please separate names with &quot;, &quot;">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    }
                >
                    {getFieldDecorator('producers', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input producers'
                            }
                        ],
                        initialValue: item.producers
                    })(
                        <Input placeholder="Anatole Dauman, Ingrid Windisch, Joachim von Mengershausen, Pascale Daum" />
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label={
                        <span>
                            Actors&nbsp;
                            <Tooltip title="Please separate names with &quot;, &quot;">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    }
                >
                    {getFieldDecorator('actors', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input actors'
                            }
                        ],
                        initialValue: item.actors
                    })(<Input placeholder="Bruno Ganz, Solveig Dommartin, Otto Sander, Curt Bois, Peter Falk" />)}
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
                    })(<Input placeholder="German" />)}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label={
                        <span>
                            Subtitles&nbsp;
                            <Tooltip title="Please separate languages with &quot;, &quot;">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    }
                >
                    {getFieldDecorator('subtitles', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input subtitled languages'
                            }
                        ],
                        initialValue: item.subtitles
                    })(<Input placeholder="English, French" />)}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label={
                        <span>
                            Dubbed&nbsp;
                            <Tooltip title="Please separate languages with &quot;, &quot;">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    }
                >
                    {getFieldDecorator('dubbed', {
                        rules: [
                            {
                                required: false
                            }
                        ],
                        initialValue: item.dubbed
                    })(<Input placeholder="English, French" />)}
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

                <FormItem
                    {...formItemLayout}
                    label={
                        <span>
                            Runtime&nbsp;
                            <Tooltip title="Please enter minutes">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    }
                >
                    {getFieldDecorator('runtime', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input runtime'
                            },
                            {
                                type: 'integer',
                                message: 'Please input an integer'
                            }
                        ],
                        initialValue: item.runtime
                    })(<InputNumber placeholder="127" />)}
                </FormItem>

                <Card title="Movie Copies">
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
                                    initialValue: item.copies && item.copies[copy]
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

const WrappedMovieForm = Form.create()(MovieForm);
export default WrappedMovieForm;
