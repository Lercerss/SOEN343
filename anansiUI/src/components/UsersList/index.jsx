import React from 'react';
import { List, Button, Card, Icon, Form, Radio } from 'antd';
import { getAllUsers } from '../../utils/httpUtils';
import { Link } from 'react-router-dom';

const maxLoginDelay = 60 * 60 * 1000; // 1 hour in milliseconds
const styles = {
    Card: {
        margin: '10px',
        padding: '5px'
    },
    Form: {
        textAlign: 'center'
    }
};
export default class UsersList extends React.Component {

    constructor(props){ 
        super(props)
    }
    
    state = {
        users: [],
        shownList: []
    };

    handleView = e => {
        if (e.target.value === 'All') {
            this.setState({
                shownList: this.state.users
            });
        } else {
            let shownList = this.state.users.filter(
                user => user.loggedIn && Date.now() - new Date(user.timestamp) < maxLoginDelay
            );
            this.setState({
                shownList: shownList
            });
        }
    };
    componentDidMount() {
        getAllUsers()
            .then(response => {
                this.setState({
                    users: response.data,
                    shownList: response.data
                });
            })
            .catch(error => {
                alert(error);
            });
    }
    render() {
        const { users, shownList } = this.state;
        const now = Date.now();
        if (!users) {
            return <h2>Loading...</h2>;
        }
        return (
            <Card style={styles.card}>
                <Form style={styles.Form}>
                    <Form.Item>
                        <Radio.Group
                            defaultValue="All"
                            buttonStyle="solid"
                            onChange={this.handleView}
                        >
                            <Radio.Button defaultChecked value="All">
                                All
                            </Radio.Button>
                            <Radio.Button value="loggedIn">Logged In</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Form>
                <List
                    itemLayout="horizontal"
                    size="small"
                    pagination={{
                        pageSize: 15
                    }}
                    dataSource={shownList}
                    renderItem={item => (
                        <List.Item
                            key={`${item.firstName} ${item.lastName}`}
                            actions={[
                                <Link to={`/users/${item.username}/`}>
                                    <Button
                                        type="primary"
                                    >
                                        View Profile
                                    </Button>
                                </Link>    
                            ]}
                        >
                            <List.Item.Meta
                                title={`${item.firstName} ${item.lastName}`}
                                description={
                                    <div>
                                        {item.username}
                                        {now - new Date(item.timestamp) < maxLoginDelay &&
                                            item.loggedIn && (
                                                <Icon
                                                    type="check-circle"
                                                    theme="twoTone"
                                                    twoToneColor="#52c41a"
                                                    style={{ paddingLeft: 10 }}
                                                />
                                            )}
                                    </div>
                                }
                            />
                            {item.isAdmin && 'Administrator'}
                        </List.Item>
                    )}
                />
            </Card>
        );
    }
}
