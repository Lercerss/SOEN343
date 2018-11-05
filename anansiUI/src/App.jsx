import React from 'react';
import { Layout, Modal } from 'antd';
import { withCookies, Cookies } from 'react-cookie';
import { Route, Switch } from 'react-router-dom';
import { getTokenInfo, setAppInterceptor, userLogout } from './utils/httpUtils';
import NavigationBar from './components/NavigationBar';
import AdminSider from './components/AdminSider';
import UsersList from './components/UsersList';
import RegisterForm from './components/RegisterForm';
import ItemsList from './components/ItemsList';
import AddMediaForm from './components/AddMediaForm';
import PrivateRoute from './components/PrivateRoute';
import './index.css';

const { Header, Sider, Content, Footer } = Layout;
const styles = {
    Layout: {
        minHeight: '100vh'
    },
    Content: {
        padding: '24px'
    },
    Footer: {
        textAlign: 'center'
    }
};
class App extends React.Component {
    state = {
        loggedIn: false,
        username: '',
        isAdmin: false
    };

    componentDidMount() {
        setAppInterceptor(this.handleExpired);
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
                    this.props.cookies.remove('jwt');
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
        let token = this.props.cookies.get('jwt');

        userLogout(token)
            .then(response => {
                this.setState({
                    loggedIn: false,
                    username: '',
                    isAdmin: false
                });
                this.props.cookies.remove('jwt');
            })
            .catch(err => {
                alert(err.response.data.message);
            });
    };
    handleExpired = () => {
        if (!this.state.loggedIn) {
            // Should not warn for invalid token when user is not logged in
            return;
        }
        console.log('Expired token found by App');
        Modal.error({
            title: 'Expired Token',
            content: 'Please log in for this request.'
        });
        this.setState({
            loggedIn: false,
            username: '',
            isAdmin: false
        });
        this.props.cookies.remove('jwt');
    };
    render() {
        const token = this.props.cookies.get('jwt');
        return (
            <main>
                <Layout style={styles.Layout}>
                    <NavigationBar
                        handleLogin={this.handleLogin}
                        handleLogout={this.handleLogout}
                        loggedIn={this.state.loggedIn}
                    />

                    <Layout>
                        {this.state.isAdmin && <AdminSider />}
                        <Content style={styles.Content}>
                            <Switch>
                                <PrivateRoute path="/users/register" condition={this.state.isAdmin}>
                                    <RegisterForm token={token} />
                                </PrivateRoute>
                                <PrivateRoute path="/users" condition={this.state.isAdmin}>
                                    <UsersList token={token} />
                                </PrivateRoute>
                                <PrivateRoute path="/media/create" condition={this.state.isAdmin}>
                                    <AddMediaForm token={token} />
                                </PrivateRoute>
                                <PrivateRoute exact path="/media" condition={this.state.loggedIn}>
                                    <ItemsList token={token} />
                                </PrivateRoute>
                            </Switch>
                        </Content>
                    </Layout>
                    <Footer style={styles.Footer}>Anansi - SOEN343 Team 0</Footer>
                </Layout>
            </main>
        );
    }
}
export default withCookies(App);
