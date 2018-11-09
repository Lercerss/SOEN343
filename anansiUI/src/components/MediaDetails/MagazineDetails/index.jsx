import React from "react";
import { List } from "antd";

export default class MagazineDetails extends React.Component {
    render() {
        const { item } = this.props;
        const data = [
            { 
                title: 'Publisher:',
                content: item.itemInfo.publisher
            }, {
                title: 'Publication Date:',
                content: item.itemInfo.publicationDate.substring(0,10)
            }, {
                title: 'Language:',
                content: item.itemInfo.language
            }, {
                title: 'ISBN-10:',
                content: item.itemInfo.isbn10
            }, {
                title: 'ISBN-13:',
                content: item.itemInfo.isbn13
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
