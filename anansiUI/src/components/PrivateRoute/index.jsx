import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default class PrivateRoute extends React.Component {
    render() {
        const { condition, children, ...otherProps } = this.props;
        return (
            <Route
                exact
                {...otherProps}
                render={props =>
                    condition ? (
                        children
                    ) : (
                        <Redirect to="/" />
                    )
                }
            />
        );
    }
}
