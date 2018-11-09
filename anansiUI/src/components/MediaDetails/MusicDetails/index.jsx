import React from "react";
import { List } from "antd";

export default class MusicDetails extends React.Component {
    render() {
        const { item } = this.props;
        const data = [
            {
                title: 'Artists:',
                content: item.itemInfo.artist
            }, {
                title: 'Label:',
                content: item.itemInfo.label
            }, {
                title: 'Release Date:',
                content: item.itemInfo.releaseDate.substring(0,10)
            }, {
                title: 'Type:',
                content: item.itemInfo.type.toUpperCase()
            }, {
                title: 'ASIN:',
                content: item.itemInfo.asin
            }
        ];

        return (
            <List
                dataSource={data}
                renderItem={item => (
                    <List.Item
                        key={item}
                    >
                        <List.Item.Meta 
                            title={`${item.title}`}
                            description={`${item.content}`}
                        />
                    </List.Item>    
                )}
            />
        );
    }
}
