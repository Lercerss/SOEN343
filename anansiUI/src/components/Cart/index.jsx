import React from 'react';
import { List, Button, Card, Icon, Modal } from 'antd';
import { Link, Redirect } from 'react-router-dom';

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
    state = {
        checkoutVisible: false,
        checkoutInProgress: false,
        redirect: false
    };

    showCheckout = () => {
        this.setState({ checkoutVisible: true });
    };

    handleConfirm = () => {
        this.setState({ checkoutInProgress: true });
        const success = true; //Replace with actual success boolean
        if (success) {
            this.props.emptyCart();
            this.setState({ checkoutVisible: false });
            Modal.success({ title: 'Successfully loaned items.', onOk: this.redirect });
        } else {
            this.setState({ checkoutVisible: false });
            Modal.error({
                title: 'Error processing checkout.'
            });
        }
    };

    handleCancel = () => {
        this.setState({ checkoutVisible: false });
    };

    redirect = () => {
        this.setState({ redirect: true });
    };

    render() {
        const { cart, removeItemFromCart } = this.props;
        return (
            <div>
                {this.state.redirect && <Redirect to="/media" />}
                <Link to={'/media'}>
                    <Button type="primary" style={styles.BackButton}>
                        <Icon type="left" />
                        Back
                    </Button>
                </Link>
                <Modal
                    title="Checkout"
                    okText="Confirm"
                    visible={this.state.checkoutVisible}
                    onOk={this.handleConfirm}
                    onCancel={this.handleCancel}
                    confirmLoading={this.state.checkoutInProgress}
                    afterClose={this.handleClose}
                >
                    <h3>Please press confirm to loan the following items:</h3>
                    {cart.map(item => (
                        <p>{item.itemInfo.title}</p>
                    ))}
                </Modal>
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
                                                Remove
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
                            <Button
                                type="primary"
                                style={styles.CheckoutButton}
                                onClick={this.showCheckout}
                            >
                                Checkout
                            </Button>
                        </div>
                    )}
                </Card>
            </div>
        );
    }
}
