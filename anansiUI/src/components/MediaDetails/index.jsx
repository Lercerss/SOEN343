import React from 'react';
import BookDetails from './BookDetails';
import MagazineDetails from './MagazineDetails';
import MovieDetails from './MovieDetails';
import MusicDetails from './MusicDetails';

export default class MediaDetails extends React.Component {
    render() {
        const { item, visible, isAdmin } = this.props;
        let detailComponent = '';
        if (item.type == 'Book') detailComponent = <BookDetails isAdmin={isAdmin} item={item} />;
        else if (item.type == 'Magazine')
            detailComponent = <MagazineDetails isAdmin={isAdmin} item={item} />;
        else if (item.type == 'Movie')
            detailComponent = <MovieDetails isAdmin={isAdmin} item={item} />;
        else if (item.type == 'Music')
            detailComponent = <MusicDetails isAdmin={isAdmin} item={item} />;

        return visible && detailComponent;
    }
}
