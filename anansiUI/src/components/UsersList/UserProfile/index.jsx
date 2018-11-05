import React from 'react';
import { Card, Button, Icon, Avatar, List } from 'antd';
import { Link } from 'react-router-dom';

export default class UserProfile extends React.Component{

    getInitials = (first, last) => {
        try{
            return first.charAt(0).toUpperCase() + last.charAt(0).toUpperCase();
        } catch(err){
            return null;
        }
        
    }
    
    handleBack = () => {
        this.props.linkProps.location.handleProfileViewing(false);
    }

    render() {
        const styles = {
            Card: {
                margin: '10px',
                padding: '5px'
            },
            Button:{
                marginBottom: '10px'
            }
        };
        const user = this.props.linkProps.location.user;
        const initials = this.getInitials(user.firstName, user.lastName);
        const data = [
            {
              title: 'First name',
              content: user.firstName,
            },
            {
              title: 'Last name',
              content: user.lastName,
            },
            {
              title: 'Username',
              content: user.username,
            },
            {
              title: 'Administrator',
              content: user.isAdmin ? 'Yes': 'No',
            },
          ];

        return (
            <div>
                <Link to='../'>
                    <Button 
                        type="primary"
                        style={styles.Button}
                        onClick={this.handleBack}
                    >
                        <Icon type="left" />Back
                    </Button>
                </Link>
                <Card
                    title={ user.username.endsWith('s') ? (
                        `${user.username}' profile`
                    ) : (
                        `${user.username}'s profile`)}
                    style={ styles.card }
                    extra={ initials ? <Avatar size="large">{ initials }</Avatar> : <Avatar icon="user"/> }
                >
                    <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                            title={ <b>{ item.title }</b>}
                            description={ item.content }
                            />
                        </List.Item>
                        )}
                    />
                </Card>
            </div>
            
        )
    }
}
