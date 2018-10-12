import React from 'react';
import { Button } from 'antd';
import UsersList from './UsersList/index';
import RegisterAdmin from './RegisterAdmin';
import AddMedia from './AddMedia';
import CatalogView from '../CatalogView/index';
import { getAllUsers } from '../../utils/httpUtils';
import './index.css';

export default class Admin extends React.Component {
    state = {
        showUserList: false,
        userList: []
    };
    showUsers = () => {
        getAllUsers()
            .then(response => {
                this.setState({
                    showUserList: true,
                    userList: response.data
                });
            })
            .catch(reason => {
                this.setState({
                    showUserList: false
                });
                alert(reason);
            });
    };
    hideUserList = () => {
        this.setState({
            showUserList: false
        });
    };
    render() {
        const { token } = this.props;
        return (
            <div className="admin">
                <h1>Welcome Admin!</h1>
                <RegisterAdmin token={token} onUserRegistered={this.hideUserList} />
                <AddMedia token={token} />
                {this.state.showUserList ? (
                    <div>
                        <UsersList users={this.state.userList} />
                        <Button onClick={this.hideUserList} type="primary">
                            Back
                        </Button>
                    </div>
                ) : (
                    <Button onClick={this.showUsers} type="primary">
                        View Users
                    </Button>
                )}
                <CatalogView token={token} />
            </div>
        );
    }
}
