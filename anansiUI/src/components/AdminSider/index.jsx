import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link, withRouter } from 'react-router-dom';
const { Sider } = Layout;
const { SubMenu } = Menu;

const styles = {
    Sider: {
        width: '200px',
        backgroundColor: '#fff'
    },
    Menu: {
        height: '100%',
        borderRight: 0
    }
};
class AdminSider extends React.Component {
    render() {
        const url = this.props.location.pathname;
        let selected = '';
        if (url === '/users/') {
            selected = '1';
        } else if (url === '/users/register/') {
            selected = '2';
        } else if (url === '/media/') {
            selected = '3';
        } else if (url === '/media/create/') {
            selected = '4';
        } else if (url === '/media/transactions/'){
            selected = '5';
        }

        return (
            <Sider style={styles.Sider}>
                <Menu mode="inline" selectedKeys={[selected]} style={styles.Menu}>
                    <SubMenu
                        key="sub1"
                        title={
                            <span>
                                <Icon type="user" />
                                Users
                            </span>
                        }
                    >
                        <Menu.Item key="1">
                            <Link to="/users/">View All </Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to="/users/register/">Register New User </Link>
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="sub2"
                        title={
                            <span>
                                <Icon type="folder-open" />
                                Media
                            </span>
                        }
                    >
                        <Menu.Item key="3">
                            <Link to="/media/">View All </Link>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Link to="/media/create/">Add New Media </Link>
                        </Menu.Item>
                        <Menu.Item key="5">
                            <Link to="/media/transactions/">View Transactions </Link>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
        );
    }
}

export default withRouter(AdminSider);
