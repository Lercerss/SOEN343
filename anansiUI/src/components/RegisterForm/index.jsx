import React from 'react';
import { createNewUser } from '../../utils/httpUtils';
import { Form, Input, Tooltip, Icon, Checkbox, Modal, Button, Card } from 'antd';

const FormItem = Form.Item;

class RegisterForm extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const { firstName, lastName, email, address, username, password, phoneNumber, isAdmin } = values;

                createNewUser(
                    firstName,
                    lastName,
                    email,
                    address,
                    username,
                    password,
                    phoneNumber,
                    isAdmin
                )
                .then(response => {
                    Modal.success({
                        title: 'Your registration is complete!'
                    });
                    this.setState({
                        submissionResult: response.status,
                        message: response.data.message 
                    });
                    this.props.form.resetFields();
                    const { onUserRegistered } = this.props;
                    if (onUserRegistered) {
                        onUserRegistered();
                    }
                })
                .catch(error => {
                    if (error && error.response.status !== 401) {
                        Modal.error({
                            title: 'Failed to create a new user',
                            content: error.response
                                ? error.response.data.message
                                : 'Connection error'
                        });
                    }
                    this.setState({
                        submissionResult: error.response.status,
                        message: error.response.data.message
                    });
                });
            }
        });
    };

    handleClose = e => {
        this.setState({
            submissionResult: null,
            message: null
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 7 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: {
                    span: 10,
                    offset: 1,    
                }
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
        const formStyle = {
            paddingTop: '10px'
        };

        return (
            <Card>
                <Form onSubmit={this.handleSubmit} style={formStyle}>
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
                                    message: 'Please input a correct username, it must be at least 4 characters long with no whitespaces!',
                                    whitespace: true,
                                    min: 4,
                                    pattern: /^\S*$/
                                }
                            ]
                        })(<Input placeholder="PatTheSwedishCow" />)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="Password">
                        {getFieldDecorator('password', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input your password, it must be at least 4 characters long',
                                    min: 4
                                }
                            ]
                        })(<Input type="password" placeholder="Password" />)}
                    </FormItem>
                    <FormItem {...formItemLayout} label="First Name">
                        {getFieldDecorator('firstName', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input your first name!',
                                    pattern: /^(?! )(\w+-?\s?)+(?<! )$/
                                }
                            ]
                        })(<Input placeholder="Pat" />)}
                    </FormItem>

                    <FormItem {...formItemLayout} label="Last Name">
                        {getFieldDecorator('lastName', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input your last name!',
                                    pattern: /^(?! )(\w+-?\s?)+(?<! )$/
                                }
                            ]
                        })(<Input placeholder="Ko" />)}
                    </FormItem>

                    <FormItem {...formItemLayout} label="E-mail">
                        {getFieldDecorator('email', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input your E-mail!',
                                    type: 'email'
                                }
                            ]
                        })(<Input placeholder="pat.ko@internet.com" />)}
                    </FormItem>


                    <FormItem {...formItemLayout} label="Address">
                        {getFieldDecorator('address', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input your adress!',
                                }
                            ]
                        })(<Input placeholder="221B Baker St." />)}
                    </FormItem>

                    <FormItem {...formItemLayout} label="Phone Number">
                        {getFieldDecorator('phoneNumber', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input your phone number!',
                                    pattern: /^(\+?\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
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
            </Card>
        );
    }
}

const WrappedRegisterForm = Form.create()(RegisterForm);
export default WrappedRegisterForm;
