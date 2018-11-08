import React from "react";
import { List } from "antd";

export default class MusicDetails extends React.Component {
    render() {
        const { item } = this.props;

        return (
            <List>
                <List.Item>
                    <List.Item.Meta
                        title={`Artist: ${item.itemInfo.artist}`}
                    />
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        title={`Label: ${item.itemInfo.label}`}
                    />
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        title={`Release Date: ${item.itemInfo.releaseDate.substring(0,10)}`}
                    />
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        title={`Type: ${item.itemInfo.type.toUpperCase()}`}
                    />
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        title={`ASIN: ${item.itemInfo.asin}`}
                    />
                </List.Item>
            </List>
        );
    }
}
