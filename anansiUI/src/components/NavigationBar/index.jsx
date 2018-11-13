import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import SignInFormWindow from '../SignInForm';

export default class NavigationBar extends React.Component {
    state = {
        openSignin: false
    };
    handleSigninButton = () => {
        this.setState({ openSignin: true });
    };

    handleCloseButton = () => {
        this.setState({ openSignin: false });
    };
    render() {
        const { openSignin, openSignup } = this.state;
        const { handleLogin, handleLogout, loggedIn, isAdmin, username } = this.props;
        let modal;
        if (openSignin) {
            modal = (
                <div className="modal-wrap">
                    <SignInFormWindow
                        handleCloseButton={this.handleCloseButton}
                        handleLogin={handleLogin}
                    />
                </div>
            );
        } else {
            modal = '';
        }
        return (
            <div>
                <div className="navbar">
                    <div className="navbar_title">
                        <Link to="/">Anansi</Link>
                    </div>
                    <div className="navbar_links" />
                    <div className="navbar_auth">
                        {!isAdmin && loggedIn &&(
                            <div className="navbar_button">
                                <Link to={`/users/${username}`}>
                                    <button
                                        className="navbar_button"
                                    >My Profile</button>
                                </Link>
                            </div>
                        )}
                        {loggedIn && (
                            <button
                                className="navbar_button"
                                onClick={handleLogout}
                            >
                                Sign Out
                            </button>
                        )}
                        {!loggedIn && (
                            <button
                                className="navbar_button"
                                onClick={this.handleSigninButton}
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
                {modal}
            </div>
        );
    }
}
