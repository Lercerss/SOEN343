import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';

export default class App extends React.Component {
    state = {
        loggedIn: false,
        username: '',
        isAdmin: false
    };

    handleLogin = (username, jwt, isAdmin) => {
        this.setState({
            loggedIn: true,
            username: username,
            isAdmin: isAdmin
        });
    };
    handleLogout = () => {
        this.setState({
            loggedIn: false,
            username: '',
            isAdmin: false,
            jwt: ''
        });
    };
    render() {
        return (
            <main className="App">
                <NavigationBar
                    handleLogin={this.handleLogin}
                    handleLogout={this.handleLogout}
                    loggedIn={this.state.loggedIn}
                />
            </main>
        );
    }
}
