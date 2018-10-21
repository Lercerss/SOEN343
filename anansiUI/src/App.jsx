import React from 'react';
import { Layout } from 'antd';
import { withCookies, Cookies } from 'react-cookie';
import { Route, Switch } from 'react-router-dom';
import { getTokenInfo } from './utils/httpUtils';
import NavigationBar from './components/NavigationBar';
import AdminSider from './components/AdminSider';
import UsersList from './components/UsersList';
import RegisterForm from './components/RegisterForm';
import ItemsList from './components/ItemsList';
import AddMediaForm from './components/AddMediaForm';
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
                                <Route exact path="/users/" component={UsersList} />
                                <Route
                                    exact
                                    path="/users/register/"
                                    render={props => (
                                        <RegisterForm token={this.props.cookies.get('jwt')} />
                                    )}
                                />
                                <Route
                                    exact
                                    path="/media/"
                                    render={props => (
                                        <ItemsList token={this.props.cookies.get('jwt')} />
                                    )}
                                />
                                <Route
                                    exact
                                    path="/media/create/"
                                    render={props => (
                                        <AddMediaForm token={this.props.cookies.get('jwt')} />
                                    )}
                                />
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
