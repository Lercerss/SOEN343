import React from 'react';
import { Card } from 'antd';
import ItemsList from './ItemsList/index';
import { viewItems } from '../../utils/httpUtils';

export default class CatalogView extends React.Component {
    state = {
        showItemList: false,
        itemList: []
    };
    componentDidMount() {
        viewItems()
            .then(response => {
                this.setState({
                    itemList: response.data
                });
            })
            .catch(reason => {
                alert(reason);
            });
    }

    hideItemList = () => {
        this.setState({
            showItemList: false
        });
    };
    render() {
        const { token } = this.props;
        return (
            <div className="viewItems">
                <ItemsList items={this.state.itemList} token={token} />
            </div>
        );
    }
}
