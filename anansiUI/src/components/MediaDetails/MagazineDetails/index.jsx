import React from "react";
import { List } from "antd";

export default class MagazineDetails extends React.Component {
    render() {
        const { item } = this.props;

        return (
            <List>
                <List.Item>
                    <List.Item.Meta
                        title={`Publisher: ${item.itemInfo.publisher}`}
                    />
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        title={`Publication Date: ${item.itemInfo.publicationDate.substring(0,10)}`}
                    />
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        title={`Language: ${item.itemInfo.language}`}
                    />
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        title={`ISBN-10: ${item.itemInfo.isbn10}`}
                    />
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        title={`ISBN-13: ${item.itemInfo.isbn13}`}
                    />
                </List.Item>
            </List>
        );
    }
}
