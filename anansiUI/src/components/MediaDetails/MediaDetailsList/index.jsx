import React from "react";
import { List } from "antd";

export default class MediaDetailsList extends React.Component {
    render() {
        const { data } = this.props;
        const listStyle = {
            backgroundColor: '#edeeef',
            padding: '0 0 0 10px'

        };
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

        return (
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
        );
    }
}