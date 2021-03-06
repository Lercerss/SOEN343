import React from 'react';
import MediaDetailsList from '../../MediaDetailsList';
import { prettifyTimeStamp } from '../../../utils/formatUtils';

export default class BookDetails extends React.Component {
    render() {
        const { item, isAdmin } = this.props;
        const data = [
            {
                title: 'Author:',
                content: item.itemInfo.author
            },
            {
                title: 'Format:',
                content: item.itemInfo.format
                    ? item.itemInfo.format.charAt(0).toUpperCase() + item.itemInfo.format.substr(1)
                    : ''
            },
            {
                title: 'Publisher:',
                content: item.itemInfo.publisher
            },
            {
                title: 'Number of Pages:',
                content: item.itemInfo.pages
            },
            {
                title: 'Publication Date:',
                content: prettifyTimeStamp(item.itemInfo.publicationDate)
            },
            {
                title: 'Language:',
                content: item.itemInfo.language
            },
            {
                title: 'ISBN-10:',
                content: item.itemInfo.isbn10
            },
            {
                title: 'ISBN-13:',
                content: item.itemInfo.isbn13
            }
        ];

        return (
            <MediaDetailsList
                isAdmin={isAdmin}
                type="Book"
                data={data}
                copies={item.itemInfo.copies}
            />
        );
    }
}
