import React from 'react';
import UsersList from './UsersList/index';
import RegisterAdmin from './RegisterAdmin';
import AddMedia from './AddMedia';

export default class Admin extends React.Component {
    state = {
        showUserList: false
    };
    showUsers = () => {
        this.setState({
            showUserList: true,
        });
    }
    render() {
        const { token } = this.props;
        return (
            <div className='admin'>
                <h1>Welcome Admin!</h1>
                <RegisterAdmin token={token}/>
                <AddMedia token={token}/>
                <button onClick={this.showUsers}>View Users</button>
                { this.state.showUserList ? <UsersList /> : null }
            </div>
        );
    }
}
