import React from "react";
import MediaDetailsList from "../../MediaDetailsList";

export default class MusicDetails extends React.Component {
    render() {
        const { item } = this.props;
        const data = [
            {
                title: 'Artists:',
                content: item.itemInfo.artist
            }, {
                title: 'Label:',
                content: item.itemInfo.label
            }, {
                title: 'Release Date:',
                content: item.itemInfo.releaseDate.substring(0,10)
            }, {
                title: 'Type:',
                content: item.itemInfo.type.toUpperCase()
            }, {
                title: 'ASIN:',
                content: item.itemInfo.asin
            }
        ];

        return (
            <MediaDetailsList 
                data={data} 
                copies={item.itemInfo.copies}
            />
        );
    }
}
