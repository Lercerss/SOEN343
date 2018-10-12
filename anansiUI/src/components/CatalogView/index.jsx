import React from 'react';
import { Form, Input, Tooltip, Icon, Checkbox, Button } from 'antd';
import ItemsList from './ItemsList/index';
import { viewItems } from '../../utils/httpUtils';


export default class CatalogView extends React.Component {
    state = {
        showItemList: false,
        itemList: []
    };
    
    showItems = () => {
        viewItems().then(response => {
            this.setState({
                showItemList: true,
                itemList: response.data
            });
        }).catch(reason => {
            this.setState({
                showItemList: false
            });
            alert(reason);
        })
    }

    hideItemList = () => {
        this.setState({
            showItemList: false
        });
    }
    render() {
        const { token } = this.props;
        return (
                
            <div className= 'viewItems'>
                {this.state.showItemList ? 
                    ( 
                        <div> 
                            <ItemsList items={this.state.itemList} action="insert" token={token}/>
                            <Button onClick={this.hideItemList} type='primary'>Back</Button>
                        </div>
                    ):
                    (
                        <Button onClick={this.showItems} type='primary'>View Items</Button>
                    )
                }
            </div> 
            
        );
    }
            
}
    




