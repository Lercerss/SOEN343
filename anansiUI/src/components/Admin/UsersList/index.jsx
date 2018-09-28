import React from 'react';
import { getAllUsers } from '../../../utils/httputil';

export default class UsersList extends React.Component {
    state = {
        usersList: []
    }
    componentDidMount() {
        getAllUsers().then(response => {
            console.log(response.data);
            this.setState({
                usersList: response.data
            });
        },
        function(err) {
            if (err) throw err;
        });
    }
    render() {
        // output a list of users
        let data =  this.state.usersList.map((user) => {
                return JSON.stringify(user);
            });
        
        return (
           <div>{data}</div>
        );
    }
}
