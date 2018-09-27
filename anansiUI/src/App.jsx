import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import { withCookies, Cookies } from 'react-cookie';
import { getTokenInfo } from './utils/httputil';

class App extends React.Component {
    state = {
        loggedIn: false,
        username: '',
        isAdmin: false
    };

    componentDidMount() {
        // If jwt is stored in cookies
        // It sends it to server to validate it
        // and gather user info
        const jwt = this.props.cookies.get('jwt');
        if (jwt) {
            getTokenInfo(jwt)
                .then(response => {
                    console.log(response.data.data);
                    this.setState({
                        loggedIn: true,
                        username: response.data.username,
                        isAdmin: response.data.isAdmin
                    });
                })
                .catch(err => {
                    console.log('Token has expired.');
                });
        }
    }
    handleLogin = (username, isAdmin, token) => {
        this.setState({
            username: username,
            isAdmin: isAdmin,
            loggedIn: true
        });
        this.props.cookies.set('jwt', token);
    };
    handleLogout = () => {
        this.setState({
            loggedIn: false,
            username: '',
            isAdmin: false
        });
        this.props.cookies.remove('jwt');
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
export default withCookies(App);
