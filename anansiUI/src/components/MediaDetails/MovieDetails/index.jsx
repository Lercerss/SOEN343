import React from 'react';
import MediaDetailsList from '../../MediaDetailsList';
import { prettifyTimeStamp } from '../../../utils/formatUtils';

export default class MovieDetails extends React.Component {
    render() {
        const { item, isAdmin } = this.props;
        const data = [
            {
                title: 'Actors:',
                content: item.itemInfo.actors
            },
            {
                title: 'Director:',
                content: item.itemInfo.director
            },
            {
                title: 'Producers:',
                content: item.itemInfo.producers
            },
            {
                title: 'Release Date:',
                content: prettifyTimeStamp(item.itemInfo.releaseDate)
            },
            {
                title: 'Language:',
                content: item.itemInfo.language
            },
            {
                title: 'Subtitles:',
                content: item.itemInfo.subtitles
            }
        ];

        return (
            <MediaDetailsList
                isAdmin={isAdmin}
                type="Movie"
                data={data}
                copies={item.itemInfo.copies}
            />
        );
    }
}
