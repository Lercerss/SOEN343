import React from 'react';
import { List, Button, Card, Icon } from 'antd';


export default class ItemsList extends React.Component {
	handleEdit = (item) => {
		console.log(`TODO: Implement editing media info. \nClicked ${JSON.stringify(item)}`)
	}

	render() {
		const { items } = this.props;
		const now = Date.now();
		if (!items) {
			retun (<h2>Loading...</h2>);
		}
		return ( 
			<Card className='item-card'>
				<List
					itemLayout='horizontal'
					size='small'
					pagination={{
						pageSize: 50
					}}
					dataSource={items}
					renderItem={item => (
						<List.Item
							key={`${item.title}`}
							actions={[<Button onClick={(e) => this.handleEdit(item)} type='primary'>Edit</Button>]}
						>
							<List.Item.Meta
								title={`${item.title}`}
								description={(
									<div>
										{item.type}
									</div>	
								)}
							/>
						</List.Item>
					)}
				/>
			</Card>
		);
	}	
}