import React from "react";
import { Collapse } from "antd";
import BookDetails from "./BookDetails";
import MagazineDetails from "./MagazineDetails";
import MovieDetails from "./MovieDetails";
import MusicDetails from "./MusicDetails";

export default class MediaDetails extends React.Component {
    render() {
        const { item } = this.props;
        const customPanelStyle = {
            border: 0,
            overflow: "hidden"
        };

        let detailComponent = '';
        if (item.type == 'Book') detailComponent = <BookDetails item={item} />;
        else if (item.type == 'Magazine') detailComponent = <MagazineDetails item={item} />;
        else if (item.type == 'Movie') detailComponent = <MovieDetails item={item} />;
        else if (item.type == 'Music') detailComponent = <MusicDetails item={item} />;
        
        return this.props.visible && detailComponent;
    }
}
