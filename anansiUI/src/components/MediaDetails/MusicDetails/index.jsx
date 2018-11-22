import React from 'react';
import MediaDetailsList from '../../MediaDetailsList';
import { prettifyTimeStamp } from '../../../utils/formatUtils';

export default class MusicDetails extends React.Component {
    render() {
        const { item, isAdmin } = this.props;
        const data = [
            {
                title: 'Artists:',
                content: item.itemInfo.artist
            },
            {
                title: 'Label:',
                content: item.itemInfo.label
            },
            {
                title: 'Release Date:',
                content: prettifyTimeStamp(item.itemInfo.releaseDate)
            },
            {
                title: 'Type:',
                content: item.itemInfo.type.toUpperCase()
            },
            {
                title: 'ASIN:',
                content: item.itemInfo.asin
            }
        ];

        return (
            <MediaDetailsList
                isAdmin={isAdmin}
                type="Music"
                data={data}
                copies={item.itemInfo.copies}
            />
        );
    }
}
