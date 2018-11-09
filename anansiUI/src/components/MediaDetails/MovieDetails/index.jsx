import React from "react";
import { List } from "antd";

export default class MovieDetails extends React.Component {
    render() {
        const { item } = this.props;
        const data = [
            {
                title: 'Actors:',
                content: item.itemInfo.actors
            }, {
                title: 'Director:',
                content: item.itemInfo.director
            }, {
                title: 'Producers:',
                content: item.itemInfo.producers
            }, {
                title: 'Release Date:',
                content: item.itemInfo.releaseDate.substring(0, 10)
            }, {
                title: 'Language:',
                content: item.itemInfo.language
            }, {
                title: 'Subtitles:',
                content: item.itemInfo.subtitles
            }
        ];

        return (
            <List
                dataSource={data}
                renderItem={item => (
                    <List.Item
                        key={item}
                    >
                    {item.title}
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
