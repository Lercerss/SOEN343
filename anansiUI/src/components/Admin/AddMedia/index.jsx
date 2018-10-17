import React from 'react';
import { Button } from 'antd';
import AddMediaForm from './../../AddMediaForm';

export default class AddMedia extends React.Component {
    state = {
        isAddMediaButtonShown: true,
        isAddMediaFormShown: false
    };

    handleView = () => {
        this.setState({ isAddMediaFormShown: true }),
            this.setState({ isAddMediaButtonShown: false });
    };
    handleClose = () => {
        this.setState({
            isAddMediaButtonShown: true,
            isAddMediaFormShown: false
        });
    };

    render() {
        const { token } = this.props;

        return (
            <div>
                {this.state.isAddMediaButtonShown ? (
                    <Button onClick={this.handleView} type="primary">
                        Add Media
                    </Button>
                ) : (
                    ''
                )}
                {this.state.isAddMediaFormShown ? (
                    <AddMediaForm handleClose={this.handleClose} token={token} />
                ) : (
                    ''
                )}
            </div>
        );
    }
}
