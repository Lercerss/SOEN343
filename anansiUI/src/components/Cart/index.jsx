import React from 'react';
import { List, Button, Card, Icon } from 'antd';
import { Link } from 'react-router-dom';

const styles = {
    Card: {
        padding: '5px'
    },
    BackButton: {
        marginBottom: '10px'
    },
    CheckoutButton: {
        marginTop: '10px'
    }
};

export default class Cart extends React.Component {
    render() {
        const { token, cart, removeItemFromCart, emptyCart } = this.props;
        return (
            <div>
                <Link to={'/media'}>
                    <Button type="primary" style={styles.BackButton}>
                        <Icon type="left" />
                        Back
                    </Button>
                </Link>
                <Card title="Cart" style={styles.Card}>
                    {cart.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        <div>
                            <List
                                itemLayout="horizontal"
                                dataSource={cart}
                                renderItem={item => (
                                    <List.Item
                                        key={`${item.itemInfo.title}`}
                                        actions={[
                                            <Button onClick={e => removeItemFromCart(item)}>
                                                Remove From Cart
                                            </Button>
                                        ]}
                                    >
                                        <List.Item.Meta
                                            title={`${item.itemInfo.title}`}
                                            description={<div>{item.type}</div>}
                                        />
                                    </List.Item>
                                )}
                            />
                            <Button type="primary" style={styles.CheckoutButton}>
                                Checkout
                            </Button>
                        </div>
                    )}
                </Card>
            </div>
        );
    }
}
