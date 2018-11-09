import React from "react";
import { List } from "antd";

export default class MovieDetails extends React.Component {
    render() {
        const { item } = this.props;

        return (
            <List>
                <List.Item>
                    <List.Item.Meta
                        title={`Actors: ${item.itemInfo.actors}`}
                    />
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        title={`Director: ${item.itemInfo.director}`}
                    />
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        title={`Producers: ${item.itemInfo.producers}`}
                    />
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        title={`Release Date: ${item.itemInfo.releaseDate.substring(0,10)}`}
                    />
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        title={`Language: ${item.itemInfo.language}`}
                    />
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        title={`Subtitles: ${item.itemInfo.subtitles}`}
                    />
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        title={`Dubbed: ${item.itemInfo.dubbed}`}
                    />
                </List.Item>
                <List.Item>
                    <List.Item.Meta
                        title={`Run Time: ${item.itemInfo.runtime} minutes`}
                    />
                </List.Item>
            </List>
        );
    }
}
