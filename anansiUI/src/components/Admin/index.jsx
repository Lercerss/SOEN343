import React from 'react';
import UsersList from './UsersList/index';

export default class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showUserList: false,
        };
        this.showUsers = this.showUsers.bind(this);
    }
    showUsers() {
        this.setState({
            showUserList: true,
        });
    }
    render() {
        return (
            <div>
                <button onClick={this.showUsers}>View Users</button>
                { this.state.showUserList ? <UsersList /> : null }
            </div>
        );
    }
}
