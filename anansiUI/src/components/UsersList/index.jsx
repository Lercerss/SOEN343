import React from 'react';
import { List, Button, Card, Icon } from 'antd';
import { getAllUsers } from '../../utils/httpUtils';

const maxLoginDelay = 15 * 60 * 1000; // 15 minutes in milliseconds
const styles = {
    Card: {
        margin: '10px',
        padding: '5px'
    }
};
export default class UsersList extends React.Component {
    state = {
        users: []
    };
    handleEdit = item => {
        console.log(`TODO: Implement editing user info.\nClicked ${JSON.stringify(item)}`);
    };
    componentDidMount() {
        getAllUsers()
            .then(response => {
                this.setState({
                    users: response.data
                });
            })
            .catch(error => {
                alert(error);
            });
    }
    render() {
        const { users } = this.state;
        const now = Date.now();
        if (!users) {
            return <h2>Loading...</h2>;
        }
        return (
            <Card style={styles.card}>
                <List
                    itemLayout="horizontal"
                    size="small"
                    pagination={{
                        pageSize: 15
                    }}
                    dataSource={users}
                    renderItem={item => (
                        <List.Item
                            key={`${item.firstName} ${item.lastName}`}
                            actions={[
                                <Button onClick={e => this.handleEdit(item)} type="primary">
                                    Edit
                                </Button>
                            ]}
                        >
                            <List.Item.Meta
                                title={`${item.firstName} ${item.lastName}`}
                                description={
                                    <div>
                                        {item.username}
                                        {now - new Date(item.timestamp) < maxLoginDelay && (
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
