import React from 'react';
import { Form, Icon, Input, Button, Modal } from 'antd';
import { Cookies } from 'react-cookie';
import { userLogin } from '../../utils/httpUtils';

const FormItem = Form.Item;
const styles = {
    Form: {
        minWidth: '400px',
        padding: '20px',
        backgroundColor: 'white',
        position: 'fixed',
        paddingTop: '40px'
    },
    Submit: {
        width: '100%'
    },
    Close: {
        textAlign: 'right',
        position: 'absolute',
        right: '4px',
        top: '4px',
        padding: '5px 10px',
        cursor: 'pointer'
    }
};
class SignInForm extends React.Component {
    state = {
        sent: false
    };
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log(values);
                const { userName, password } = values;
                const { handleLogin, handleCloseButton } = this.props;
                this.setState({ sent: true });
                userLogin(userName, password)
                    .then(response => {
                        const { username, isAdmin, token } = response.data;

                        handleLogin(username, isAdmin, token);
                        this.setState({ sent: false });
                        handleCloseButton();
                    })
                    .catch(err => {
                        Modal.error({ content: err.response.data.message });
                        this.setState({ sent: false });
                    });
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        const { handleCloseButton } = this.props;

        return (
            <Form onSubmit={this.handleSubmit} style={styles.Form}>
                <div
                    style={styles.Close}
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
                            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
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
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="Password"
                        />
                    )}
                </FormItem>
                <FormItem>
                    <Button
                        disabled={this.state.sent}
                        loading={this.state.sent}
                        type="primary"
                        htmlType="submit"
                        style={styles.Submit}
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
