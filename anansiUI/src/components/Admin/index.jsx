import React from 'react';
import UsersList from './UsersList/index';
import RegisterAdmin from './RegisterAdmin';

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
        const { token } = this.props;
        return (
            <div>
                <div className='admin'>
                    <h1>Welcome Admin!</h1>
                    <RegisterAdmin token={token}/>
                </div>
                <div>
                    <button onClick={this.showUsers}>View Users</button>
                    { this.state.showUserList ? <UsersList /> : null }
                </div>
            </div>
        );
    }
}
