import React from 'react';
import { Card, Button, Icon, Avatar, List, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { getUserProfile } from '../../utils/httpUtils';
import LoanedList from './LoanedList';

export default class UserProfile extends React.Component {
    state = {
        user: {}
    };

    componentDidMount() {
        this.getUserInfo();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.linkProps.computedMatch.params.username != this.props.linkProps.computedMatch.params.username) {
            this.getUserInfo();
        }
    }

    getUserInfo = () => {
        getUserProfile(this.props.linkProps.computedMatch.params.username)
            .then(response => {
                this.setState({
                    user: response.data.user
                });
            })
            .catch(reason => {
                Modal.error({
                    title: 'User profile could not be fetched.'
                });
            });
    };
    getInitials = (first, last) => {
        try {
            return first.charAt(0).toUpperCase() + last.charAt(0).toUpperCase();
        } catch (err) {
            return null;
        }
    };

    render() {
        if (Object.keys(this.state.user).length === 0) {
            return <h2>Loading...</h2>;
        }

        const styles = {
            Card: {
                margin: '10px',
                padding: '5px'
            },
            Button: {
                marginBottom: '10px'
            }
        };
        const { user } = this.state;
        const isCurrentUserAdmin = this.props.isCurrentUserAdmin;
        const initials = this.getInitials(user.firstName, user.lastName);

        const data = [
            {
                title: 'First name',
                content: user.firstName
            },
            {
                title: 'Last name',
                content: user.lastName
            },
            {
                title: 'Username',
                content: user.username
            },
            {
                title: 'Email',
                content: user.email
            },
            {
                title: 'Address',
                content: user.address ? user.address : 'N/A'
            },
            {
                title: 'Phone Number',
                content: user.phoneNumber ? user.phoneNumber : 'N/A'
            },
            {
                title: 'Administrator',
                content: user.isAdmin ? 'Yes' : 'No'
            }
        ];
        return (
            <div>
                <Link to={isCurrentUserAdmin ? '../' : '../../'}>
                    <Button type="primary" style={styles.Button}>
                        <Icon type="left" />
                        Back
                    </Button>
                </Link>
                <Card
                    title={user.username.endsWith('s') ? `${user.username}' profile` : `${user.username}'s profile`}
                    style={styles.card}
                    extra={initials ? <Avatar size="large">{initials}</Avatar> : <Avatar icon="user" />}
                >
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                            <List.Item key={`${item.username}`}>
                                <List.Item.Meta title={<b>{item.title}</b>} description={item.content} />
                            </List.Item>
                        )}
                    />
                </Card>
                {!isCurrentUserAdmin && (
                    <Card>
                        <p>
                            <b>Your Loans</b>
                        </p>
                        <LoanedList userID={user.client_id} />
                    </Card>
                )}
            </div>
        );
    }
}
