import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export default class PrivateRoute extends React.Component {
    
    render() {
        const { condition, children, ...otherProps } = this.props;
        const child = React.Children.only(children);
        const childrenWithProps = React.cloneElement(child, {
            linkProps: otherProps
        });

        return (    
            <Route
                exact
                {...otherProps}
                render={props =>
                    condition ? (
                        childrenWithProps
                    ) : (
                        <Redirect to="/" />
                    )
                }
            />
        );
    }
}
