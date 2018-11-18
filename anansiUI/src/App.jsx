import React from 'react';
import { Layout, Modal } from 'antd';
import { withCookies } from 'react-cookie';
import { Switch, Redirect, withRouter } from 'react-router-dom';
import { getTokenInfo, setAppInterceptor, userLogout } from './utils/httpUtils';
import NavigationBar from './components/NavigationBar';
import AdminSider from './components/AdminSider';
import UsersList from './components/UsersList';
import RegisterForm from './components/RegisterForm';
import ItemsList from './components/ItemsList';
import AddMediaForm from './components/AddMediaForm';
import PrivateRoute from './components/PrivateRoute';
import UserProfile from './components/UserProfile';
import Cart from './components/Cart';
import './index.css';

const { Content, Footer } = Layout;
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
        isAdmin: false,
        cart: []
    };

    addItemToCart = item => {
        const cart = this.state.cart;
        const mappedCart = cart.map(function(e) {
            return e.itemInfo.id + e.type;
        });
        const loanedItems = []; // TODO: Replace with list of loaned items from backend
        if (loanedItems.length === 10) {
            Modal.error({
                title: 'Cannot add items to cart',
                content:
                    'You currently have 10 items on loan. Please make a return before adding items to your cart.'
            });
        } else if (cart.length === 10 - loanedItems.length) {
            Modal.error({
                title: 'Cannot add more items to cart.',
                content:
                    'Your current number of items on loan: ' +
                    loanedItems.length +
                    '. You can only loan 10 items at a time.'
            });
        } else if (loanedItems.includes(item)) {
            Modal.error({
                title: 'Cannot add item to cart',
                content: 'You currently have this item on loan.'
            });
        } else if (item.type === 'Magazine') {
            Modal.error({ title: 'Cannot loan magazines.' });
        } else if (!mappedCart.includes(item.itemInfo + item.type)) {
            cart.push(item);
            this.setState({ cart: cart });
        } else {
            Modal.error({
                title: 'Item is already in cart.'
            });
        }
    };

    removeItemFromCart = item => {
        const cart = this.state.cart;
        const mappedCart = cart.map(function(e) {
            return e.itemInfo.id + e.type;
        });
        const itemIndex = mappedCart.indexOf(item.itemInfo.id + item.type);
        if (itemIndex !== -1) {
            cart.splice(itemIndex, 1);
            this.setState({ cart: cart });
        } else {
            Modal.error({
                title: 'Item not found in cart.'
            });
        }
    };

    emptyCart = () => {
        this.setState({ cart: [] });
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
        this.props.cookies.set('jwt', token);
        this.setState({
            username: username,
            isAdmin: isAdmin,
            loggedIn: true
        });
    };
    handleLogout = () => {
        let token = this.props.cookies.get('jwt');

        userLogout(token)
            .then(response => {
                this.setState({
                    loggedIn: false,
                    username: '',
                    isAdmin: false,
                    cart: []
                });
                this.props.cookies.remove('jwt');
            })
            .catch(err => {
                Modal.error({
                    title: 'Failed to sign out',
                    content: err.response.data ? err.response.data.message : 'Connection error'
                });
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
            isAdmin: false,
            cart: []
        });
        this.props.cookies.remove('jwt');
    };
    render() {
        const token = this.props.cookies.get('jwt');

        if (!this.state.isAdmin && this.state.loggedIn && this.props.location.pathname === '/') {
            return <Redirect to="/media" />;
        }

        return (
            <main>
                <Layout style={styles.Layout}>
                    <NavigationBar
                        handleLogin={this.handleLogin}
                        handleLogout={this.handleLogout}
                        loggedIn={this.state.loggedIn}
                        isAdmin={this.state.isAdmin}
                        username={this.state.username}
                        cart={this.state.cart}
                    />

                    <Layout>
                        {this.state.isAdmin && <AdminSider />}
                        <Content style={styles.Content}>
                            <Switch>
                                <PrivateRoute path="/users/register" condition={this.state.isAdmin}>
                                    <RegisterForm />
                                </PrivateRoute>
                                <PrivateRoute
                                    path="/users/:username"
                                    condition={this.state.loggedIn}
                                >
                                    <UserProfile isCurrentUserAdmin={this.state.isAdmin} />
                                </PrivateRoute>
                                <PrivateRoute path="/users" condition={this.state.isAdmin}>
                                    <UsersList />
                                </PrivateRoute>
                                <PrivateRoute path="/media/create" condition={this.state.isAdmin}>
                                    <AddMediaForm />
                                </PrivateRoute>
                                <PrivateRoute exact path="/media" condition={this.state.loggedIn}>
                                    <ItemsList
                                        token={token}
                                        isAdmin={this.state.isAdmin}
                                        cart={this.state.cart}
                                        removeItemFromCart={this.removeItemFromCart}
                                        addItemToCart={this.addItemToCart}
                                    />
                                </PrivateRoute>
                                <PrivateRoute
                                    path="/cart"
                                    condition={this.state.loggedIn && !this.state.isAdmin}
                                >
                                    <Cart
                                        cart={this.state.cart}
                                        removeItemFromCart={this.removeItemFromCart}
                                        emptyCart={this.emptyCart}
                                    />
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
export default withRouter(withCookies(App));
