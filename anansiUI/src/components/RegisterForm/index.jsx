import React from 'react';
import { Form, Input, Tooltip, Icon, Checkbox, Button } from 'antd';
import { createNewUser } from '../../utils/httpUtils';

const FormItem = Form.Item;

class RegisterForm extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const { firstName, lastName, email, username, password, phoneNumber, isAdmin } = values;
                const { token } = this.props;

                createNewUser(firstName, lastName, email, username, password, phoneNumber, isAdmin, token)
                    .then(response => {
                        console.log(response);
                    });
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;

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
            <Form onSubmit={this.handleSubmit} className="RegisterForm">
                <FormItem {...formItemLayout} label="First Name">
                    {getFieldDecorator('firstName', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your first name!'
                            }
                        ]
                    })(<Input placeholder="Pat" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Last Name">
                    {getFieldDecorator('lastName', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your last name'
                            }
                        ]
                    })(<Input placeholder="Ko" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="E-mail">
                    {getFieldDecorator('email', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your E-mail!'
                            }
                        ]
                    })(<Input placeholder="pat.ko@internet.com" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Password">
                    {getFieldDecorator('password', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your password!'
                            }
                        ]
                    })(<Input type="password" placeholder="Password" />)}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label={
                        <span>
                            Username&nbsp;
                            <Tooltip title="What do you want others to call you?">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    }
                >
                    {getFieldDecorator('username', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your username!',
                                whitespace: true
                            }
                        ]
                    })(<Input placeholder="PatTheSwedishCow" />)}
                </FormItem>

                <FormItem {...formItemLayout} label="Phone Number">
                    {getFieldDecorator('phoneNumber', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your phone number!'
                            }
                        ]
                    })(<Input placeholder="xxx-xxx-xxxx" />)}
                </FormItem>

                <FormItem {...tailFormItemLayout}>
                    {getFieldDecorator('isAdmin', {
                        valuePropName: 'checked'
                    })(<Checkbox>Register as administrator</Checkbox>)}
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

const WrappedRegisterForm = Form.create()(RegisterForm);
export default WrappedRegisterForm;
