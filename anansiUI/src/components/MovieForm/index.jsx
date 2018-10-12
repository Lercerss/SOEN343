import React from 'react';
import { Form, Input, Button, DatePicker, Tooltip, Icon, InputNumber } from 'antd';
import { addNewItem, editItem } from '../../utils/httpUtils';

const FormItem = Form.Item;

class MovieForm extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const { token } = this.props;

                if (this.props.action == "insert") {
                    addNewItem('Movie', values, token)
                        .then(response => {
                            console.log(response);
                        });
                } else if (this.props.action == "update") {
                    addNewItem('Movie', values, token)
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
            <Form onSubmit={this.handleSubmit} className="MovieForm">

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

                <FormItem {...formItemLayout} label={
                    <span>
                        Producers&nbsp;
                            <Tooltip title='Please separate names with ", "'>
                            <Icon type="question-circle-o" />
                        </Tooltip>
                    </span>
                }>
                    {getFieldDecorator('producers', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input producers'
                            }
                        ],
                        initialValue: item.producers
                    })(<Input placeholder="Anatole Dauman, Ingrid Windisch, Joachim von Mengershausen, Pascale Daum" />)}
                </FormItem>

                <FormItem {...formItemLayout} label={
                    <span>
                        Actors&nbsp;
                            <Tooltip title='Please separate names with ", "'>
                            <Icon type="question-circle-o" />
                        </Tooltip>
                    </span>
                }>
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

                <FormItem {...formItemLayout} label={
                    <span>
                        Subtitles&nbsp;
                            <Tooltip title='Please separate languages with ", "'>
                            <Icon type="question-circle-o" />
                        </Tooltip>
                    </span>
                }>
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

                <FormItem {...formItemLayout} label={
                    <span>
                        Dubbed&nbsp;
                            <Tooltip title='Please separate languages with ", "'>
                            <Icon type="question-circle-o" />
                        </Tooltip>
                    </span>
                }>
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
                        initialValue: item.releaseDate
                    })(<DatePicker placeholder="2012-08-14" />)}
                </FormItem>

                <FormItem {...formItemLayout} label={
                        <span>
                            Runtime&nbsp;
                            <Tooltip title="Please enter minutes">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>                   
                }>
                    {getFieldDecorator('runtime', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input runtime'
                            },
                            {
                                type: "integer",
                                message: 'Please input an integer'
                            }
                        ],
                        initialValue: item.runtime
                    })(<InputNumber placeholder="127" />)}
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

const WrappedMovieForm = Form.create()(MovieForm);
export default WrappedMovieForm;