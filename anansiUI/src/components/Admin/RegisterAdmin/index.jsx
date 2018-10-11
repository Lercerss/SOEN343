import React from 'react';
import { Form, Input, Tooltip, Icon, Checkbox, Button } from 'antd';
import RegisterForm from './../../RegisterForm'

export default class RegisterAdmin extends React.Component {
    state = {
        isRegisterButtonShown: true,
        isFormShown: false
    };

    handleView = () => {
        this.setState({ isFormShown: true }),
        this.setState({ isRegisterButtonShown: false });
    };

    render() {
        const { token, onUserRegistered } = this.props;
        return (
            <div className='registerAdmin'>
                {this.state.isRegisterButtonShown ? 
                <Button onClick={this.handleView} type="primary"> Register </Button> : "" }

                {this.state.isFormShown ? <RegisterForm token={token} onUserRegistered={onUserRegistered} /> : ""}
            </div>
        );
    }
}
