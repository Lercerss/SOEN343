import React from 'react';
import { Form, Input, Tooltip, Icon, Checkbox, Button } from 'antd';
import RegisterForm from './../../RegisterForm'

export default class RegisterAdmin extends React.Component {
    state = {
        isformShown: false
    };

    handleFormView = () => {
        this.setState({ isFormShown: true });
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);

                // Call to database
            }
        });
    };

    render() {
        return (
            <div className='registerAdmin'>
                <Button onClick={() => handleFormView()} type="primary"> Register </Button>
                {this.state.isFormShown ? <RegisterForm /> : "" }
            </div>
        );
    }
}
