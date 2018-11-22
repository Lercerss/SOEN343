import React from 'react';
import { Button, Checkbox, Form, Modal, Row, Col } from 'antd';
import { getTransactions, returnCopies } from '../../../utils/httpUtils';
import moment from 'moment';

class LoanedList extends React.Component {
    state = {
        loanItems: [],
        checkedList: [],
        indeterminate: false,
        checkAll: false,
        radioOptions: []
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
                this.updateCurrentLoans(response.data, e => {
                    this.updateRadioButtons();
                });
            })
            .catch(reason => {
                Modal.error({
                    title: 'Error fetching loaned items',
                    content: `Loan items error:${reason}`
                });
            });
    }

    updateRadioButtons = (callback) =>{
        var _options = this.state.loanItems.map(el => {
            return {
                label: el.media.title +
                       ', due ' +
                       moment(el.expectedReturn).format('YYYY-MM-DD') +
                       (el.isExpired ? ' (This item is overdue!)' : ''),
                value: el.id
            };  
        });
        this.setState({
            radioOptions: _options
        }, callback);
    }
    updateCurrentLoans = (loanItems, callback) => {
        this.setState({
            checkedList: [],
            loanItems: loanItems
        }, callback);
    } 

    handleReturn = e => {
        e.preventDefault();
        const { form } = this.props;
        const values = this.state.checkedList;
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
                    this.updateRadioButtons(e => {
                        Modal.success({ title: 'Successfully returned item(s).' });
                    });
                });
            }).catch(error => {
                Modal.error({
                    title: 'Failed to return selected items',
                    content: error.response ? error.response.data.message : 'Connection error'
                })
            });
    }
    onChange = (checkedList) => {
        this.setState({
          checkedList: checkedList,
          indeterminate:!!checkedList.length &&
                        (checkedList.length < this.state.radioOptions.length),
          checkAll: checkedList.length === this.state.radioOptions.length,
        });
      }
    
    onCheckAllChange = (e) => {
        this.setState({
            checkedList: e.target.checked ?
                        this.state.radioOptions.map(el => {return el.value}) 
                        : [],
            indeterminate: false,
            checkAll: e.target.checked,
        });
    }

    render() {
        const { loanItems } = this.state;
        const CheckboxGroup = Checkbox.Group;
        const buttonLayout = {
            textAlign: 'center'
        };
        if (!loanItems) {
            return <h2>Loading...</h2>;
        }
        return (
            <Form layout="horizontal" onSubmit={this.handleReturn}>
                {loanItems.length !== 0 &&
                    <div>
                        <div style={{ borderBottom: '1px solid #E9E9E9' }}>
                            <Row>
                                <Checkbox
                                indeterminate={this.state.indeterminate}
                                onChange={this.onCheckAllChange}
                                checked={this.state.checkAll}
                                >
                                Return all 
                                </Checkbox>
                            </Row>
                        </div>
                        <br />
                        <CheckboxGroup  
                                    value={this.state.checkedList}
                                    onChange={this.onChange}>
                        {this.state.radioOptions.map(option =>
                            <div style={{lineHeight: '2'}}>
                                <Checkbox 
                                        value={option.value} 
                                        checked={this.state.checkAll}>{option.label}
                                </Checkbox>
                            </div>
                        )}
                        </CheckboxGroup>
                    </div>
                }
                <Form.Item key="util" style={buttonLayout}>
                    {loanItems.length === 0 ? (
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
