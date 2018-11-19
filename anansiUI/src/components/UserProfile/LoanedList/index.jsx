import React from 'react';
import { Card, Button, Icon, Avatar, List, Modal, Checkbox, Form, Row, Col } from 'antd';
import { getLoans } from '../../../utils/httpUtils';
import { Link } from 'react-router-dom';


class LoanedList extends React.Component {
    state = {
        loanItems: [],
        returnItems: [],
    };

    componentDidMount() {
        getLoans()
            .then(response => {
                console.log(response);
                response.data.forEach(item=>{
                    if (Date.now() > item.return_ts ) {
                        item.isExpired = true;
                    }
                    else {
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
    onChange = e => {
        if (e.target.checked) {
            let item = this.state.loanItems.filter(item => item.id.toString() === e.target.id)
            console.log(`setting ${e.target.id}`);
            this.setState({
                returnItems: this.state.returnItems.concat(item)
            })
        } else {
            console.log(`unsetting ${e.target.id}`);
            this.setState({
                returnItems: this.state.returnItems.filter(item => item.id.toString() !== e.target.id)
            })
        }
    }

    handleReturn = e => {
        e.preventDefault();
        const { form } = this.props;
        const values = form.getFieldsValue();
        console.log(values);
        }


    render() {
        const { getFieldDecorator } = this.props.form;
        const { token } = this.props;
        const { loanItems, } = this.state;
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
                xs: {span:16, offset:8}
            }
        }
        if (!loanItems) {
            return <h2>Loading...</h2>;
        }
        const formItems = this.state.loanItems.map((item, index) => {
            return (
                <Form.Item {...formItemLayout} validateStatus={"error"} required={false} key={`${item.id}`} label={item.itemInfo.title}>
                    {getFieldDecorator(`${item.id}`, {
                        id: item.id,
                        getValueProps: item.checked,
                        valuePropName: 'checked',
                        initialValue: false,
                    })(<Checkbox onChange={this.onChange}>

                    </Checkbox>)}
                    {item.isExpired? <span>This Item is Overdue!</span> : ""}
                </Form.Item>
            );
        });
        // console.log(this.state.loanItems)
        return (

            <Form layout='horizontal' onSubmit={this.handleReturn}>
                {formItems}
                <Form.Item {...buttonLayout}  key="util">
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