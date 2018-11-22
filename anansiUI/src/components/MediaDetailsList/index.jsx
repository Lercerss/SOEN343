import React from 'react';
import { getTransactions } from '../../utils/httpUtils';
import { List, Card, Row, Col, Icon, Tooltip, Modal } from 'antd';
import Transactions from '../Transactions';
const styles = {
    pointer: {
        cursor: 'pointer'
    }
};
export default class MediaDetailsList extends React.Component {
    showTransactions = e => {
        let filter = {
            copy_id: e.currentTarget.id,
            item_type: this.props.type
        };
        Modal.info({
            title: 'Transaction History',
            content: <Transactions filter={filter} />,
            width: '80%'
        });
    };
    render() {
        const { data, copies } = this.props;
        const listItemMetaStyle = {
            padding: '0 0 0 0',
            margin: '0 0 0 0'
        };
        const titleStyle = {
            fontSize: '14px',
            padding: '0 0 0 0',
            margin: '0 0 0 0'
        };
        const descriptionTitle = {
            fontSize: '12px',
            padding: '0 0 0 0',
            margin: '0 0 0 0'
        };
        const listStyle = {
            backgroundColor: '#f2f2f2',
            padding: '0 0 0 10px'
        };
        const cardStyle = {
            backgroundColor: '#f2f2f2'
        };

        return (
            <div>
                <Row gutter={16}>
                    <Col span={14}>
                        <List
                            style={listStyle}
                            dataSource={data}
                            renderItem={item => (
                                <List.Item key={`${item}.${Math.random()}`}>
                                    <List.Item.Meta
                                        style={listItemMetaStyle}
                                        title={<p style={titleStyle}> {item.title}</p>}
                                        description={
                                            <p style={descriptionTitle}> {item.content}</p>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Col>
                    <Col span={10}>
                        <Card title="Copies" style={cardStyle}>
                            <List
                                bordered={true}
                                dataSource={copies || []}
                                renderItem={item => (
                                    <List.Item key={`${item}.${Math.random()}`}>
                                        <List.Item.Meta
                                            style={listItemMetaStyle}
                                            title={
                                                <p style={titleStyle}>
                                                    {item.name}&nbsp;
                                                    <Tooltip title="View copy transaction history">
                                                        <Icon
                                                            onClick={this.showTransactions}
                                                            id={item.id}
                                                            style={styles.pointer}
                                                            type="file-search"
                                                        />
                                                    </Tooltip>
                                                </p>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}
