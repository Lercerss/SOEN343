import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default class PrivateRoute extends React.Component {
    render() {
        let { isAdmin, Component, handleLogout, token } = this.props;
        console.log(this.props.path);
        return (
            <Route
                exact
                path={this.props.path}
                render={props =>
                    isAdmin ? (
                        <Component handleLogout={handleLogout} token={token} />
                    ) : (
                        <Redirect to="/" />
                    )
                }
            />
        );
    }
}
