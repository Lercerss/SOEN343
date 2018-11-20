import React from 'react';
import { Button, Checkbox, Form } from 'antd';
import { getLoans } from '../../../utils/httpUtils';

class LoanedList extends React.Component {
    state = {
        loanItems: []
    };
    componentDidMount() {
        getLoans()
            .then(response => {
                console.log(response);
                response.data.forEach(item => {
                    if (Date.now() > item.return_ts) {
                        item.isExpired = true;
                    } else {
                        item.isExpire = false;
                    }
                });
                console.log(response.data);
                this.setState({
                    loanItems: response.data
                });
                console.log(this.state.loanItems);
            })
            .catch(reason => {
                console.debug(`Loan Items error:${reason}`);
            });
    }
    handleReturn = e => {
        e.preventDefault();
        const { form } = this.props;
        const values = form.getFieldsValue();
        console.log(values);
    };
    render() {
        const { getFieldDecorator } = this.props.form;
        const { token } = this.props;
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
            wrapperCol: {
                xs: { span: 16, offset: 8 }
            }
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
                    label={item.itemInfo.title}
                >
                    {getFieldDecorator(`${item.id}`, {
                        id: item.id,
                        getValueProps: item.checked,
                        valuePropName: 'checked',
                        initialValue: false
                    })(<Checkbox onChange={this.onChange} />)}
                    {item.isExpired ? <span>This Item is Overdue!</span> : ''}
                </Form.Item>
            );
        });
        // console.log(this.state.loanItems)
        return (
            <Form layout="horizontal" onSubmit={this.handleReturn}>
                {formItems}
                <Form.Item {...buttonLayout} key="util">
                    <Button type="primary" htmlType="submit">
                        Return Items
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}
const WrappedLoanedList = Form.create()(LoanedList);
export default WrappedLoanedList;
