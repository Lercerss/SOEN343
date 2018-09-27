import React from 'react';
import { Form, Icon, Input, Button, message } from 'antd';
import cookie from 'react-cookies';
import { userLogin } from '../../utils/httputil';
import './index.css';

const FormItem = Form.Item;

class SignInForm extends React.Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
                const { userName, password } = values;
                const { handleLogin, handleCloseButton } = this.props;
                userLogin(userName, password).then(response => {
                    let username = response.username;
                    let isAdmin = response.isAdmin;
                    cookie.save('jwt', response.token, { path: '/' });
                    handleLogin(username, isAdmin);
                    handleCloseButton();
                });
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { handleCloseButton } = this.props;

        return (
            <Form onSubmit={this.handleSubmit} className="SignInForm">
                <div
                    className="SignInForm_close"
                    onClick={() => handleCloseButton()}
                    onKeyPress={() => handleCloseButton()}
                    role="button"
                    tabIndex={0}
                >
                    &#10005;
                </div>
                <h3>Sign In</h3>
                <FormItem>
                    {getFieldDecorator('userName', {
                        rules: [
                            {
                                required: true,
                                message: 'Please enter your username.'
                            }
                        ]
                    })(
                        <Input
                            prefix={
                                <Icon
                                    type="user"
                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                />
                            }
                            placeholder="Username"
                            required
                        />
                    )}
                </FormItem>
                <FormItem>
                    {getFieldDecorator('password', {
                        rules: [
                            {
                                required: true,
                                message: 'Please enter your password'
                            }
                        ]
                    })(
                        <Input
                            prefix={
                                <Icon
                                    type="lock"
                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                />
                            }
                            type="password"
                            placeholder="Password"
                        />
                    )}
                </FormItem>
                <FormItem>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="SignInForm_submit"
                    >
                        Sign In
                    </Button>
                </FormItem>
            </Form>
        );
    }
}

const SignInFormWindow = Form.create()(SignInForm);
export default SignInFormWindow;
