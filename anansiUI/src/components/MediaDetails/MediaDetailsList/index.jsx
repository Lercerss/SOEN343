import React from "react";
import { List, Card, Row, Col } from "antd";

export default class MediaDetailsList extends React.Component {
    render() {
        const { data, copies } = this.props;
        const copyValues = [];
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
        }
        const cardStyle = {
            backgroundColor: '#f2f2f2'
        };

        if(copies != null) {
            Object.values(copies).forEach(element => {
                copyValues.push(Object.values(element))
            }); 
        }
        
        return (  
            <div>
                <Row gutter={16}>
                    <div>
                        <Col span={4}>
                            <List
                                style={listStyle}
                                dataSource={data}
                                renderItem={item => (
                                    <List.Item
                                        key={`${item}.${Math.random()}`}
                                    >
                                        <List.Item.Meta
                                            style={listItemMetaStyle}
                                            title={<p style={titleStyle}> {item.title}</p>}
                                            description={<p style={descriptionTitle}> {item.content}</p>}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Col>
                    </div>
                    <Col span={4}></Col>
                    <div>
                        <Col span={4}>
                            <Card title='Copies' style={cardStyle}>
                                <List
                                    bordered={true}
                                    dataSource={copyValues}
                                    renderItem={item => (
                                        <List.Item
                                            key={`${item}.${Math.random()}`}
                                        >
                                            <List.Item.Meta
                                                style={listItemMetaStyle}
                                                title={<p style={titleStyle}> {item}</p>}
                                                description={<p style={descriptionTitle}> {item}</p>}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Col>
                    </div>
                </Row>
            </div>
        );
    }
}