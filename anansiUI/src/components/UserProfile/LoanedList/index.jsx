import React from 'react';
import { Button, Checkbox, Form, Modal } from 'antd';
import { getTransactions, returnCopies } from '../../../utils/httpUtils';

class LoanedList extends React.Component {
    state = {
        loanItems: []
    };
    componentDidMount() {
        let userID = this.props.userID;
        getTransactions({ user_id: userID, return_ts: 'NULL' })
            .then(response => {
                response.data.forEach(item => {
                    if (Date.now() > Date(item.expectedReturn)) {
                        item.isExpired = true;
                    } else {
                        item.isExpired = false;
                    }
                });
                this.setState({
                    loanItems: response.data
                });
            })
            .catch(reason => {
                Modal.error({
                    title: 'Error fetching loaned items',
                    content: `Loan items error:${reason}`
                });
            });
    }

    updateCurrentLoans = (loanItems, callback) => {
        this.setState({
            loanItems: loanItems
        }, callback);
    } 

    handleReturn = e => {
        e.preventDefault();
        const { form } = this.props;
        const values = Object.entries(form.getFieldsValue()).filter(el => el[1]).map(el => parseInt(el[0]));
        returnCopies(values)
            .then(response => {
                const loanItems = this.state.loanItems.filter(el => !values.includes(el.id));
                this.updateCurrentLoans(loanItems, (err) => {
                    var mediaArr = [];
                    this.state.loanItems.forEach(el => {
                        let mediaToKeep = {
                            mediaType: el.media.type,
                            id: el.media.id
                        };
                        mediaArr.push(mediaToKeep);
                    });
                    this.props.updateLoans(mediaArr);
                    Modal.success({ title: 'Successfully returned item(s).' });
                });
            }).catch(error => {
                Modal.error({
                    title: 'Failed to return selected items',
                    content: error.response ? error.response.data.message : 'Connection error'
                })
            });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { loanItems } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: { span: 8 }
            },
            wrapperCol: {
                xs: { span: 16 }
            }
        };
        const buttonLayout = {
            textAlign: 'center'
        };
        if (!loanItems) {
            return <h2>Loading...</h2>;
        }
        const formItems = this.state.loanItems.map((item, index) => {
            return (
                <Form.Item
                    {...formItemLayout}
                    validateStatus={'error'}
                    required={false}
                    key={`${item.id}`}
                    label={item.media.title}
                >
                    {getFieldDecorator(`${item.id}`, {
                        id: item.id,
                        getValueProps: item.checked,
                        valuePropName: 'checked',
                        initialValue: false
                    })(<Checkbox onChange={this.onChange} />)}
                    {item.isExpired ? <span>This item is overdue!</span> : ''}
                </Form.Item>
            );
        });
        return (
            <Form layout="horizontal" onSubmit={this.handleReturn}>
                {formItems}
                <Form.Item key="util" style={buttonLayout}>
                    {formItems.length === 0 ? (
                        <Button type="primary" htmlType="submit" disabled>
                            Return Items
                        </Button>
                    ) : (
                        <Button type="primary" htmlType="submit">
                            Return Items
                        </Button>
                    )}
                </Form.Item>
            </Form>
        );
    }
}
const WrappedLoanedList = Form.create()(LoanedList);
export default WrappedLoanedList;
