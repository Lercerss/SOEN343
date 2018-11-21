import React from 'react';
import { Modal, Table, Button, Input, Icon, Form, Radio, Card } from 'antd';
import { getTransactions } from '../../utils/httpUtils';
import moment from 'moment';
const styles = {
    customDropdown: {
        padding: '8px',
        borderRadius: '6px',
        background: '#fff',
        boxShadow: '0 1px 6px rgba(0, 0, 0, .2)'
    },
    customDropdownInput: {
        width: '130px',
        marginRight: '8px'
    },
    customDropdownButton: {
        marginRight: '8px'
    },
    highlighted: {
        color: 'red'
    },
    Form: {
        textAlign: 'center'
    },
    Table: {
        border: '#e8e8e8 solid 1px'
    }
};
export default class Transactions extends React.Component {
    state = {
        transactions: [],
        view: 'all'
    };

    componentDidMount() {
        getTransactions({})
            .then(res => {
                console.log(res);
                let tableData = res.data.map(el => {
                    let expectedReturn = this.prettifyTimeStamp(el.expectedReturn);
                    let return_ts = this.prettifyTimeStamp(el.return_ts);

                    return {
                        key: el.id,
                        title: el.media.title,
                        copyname: el.copyname,
                        username: el.username,
                        loan_ts: this.prettifyTimeStamp(el.loan_ts),
                        return_ts: return_ts,
                        expectedReturn: expectedReturn,
                        overdue: this.checkOverdue(expectedReturn, return_ts),
                        type: el.media.type
                    };
                });
                console.log(tableData);
                this.setState({
                    transactions: tableData
                });
            })
            .catch(err => {
                Modal.error({
                    title: 'Failed to get transactions',
                    content: err.response.data ? err.response.data.message : 'Error'
                });
            });
    }
    handleSearch = (selectedKeys, confirm) => () => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    };
    setCustomFilter = (key, hard = false) => {
        let filterFunction;
        if (hard) {
            filterFunction = (value, record) => record[key] === value.toLowerCase();
        } else {
            filterFunction = (value, record) =>
                record[key].toLowerCase().includes(value.toLowerCase());
        }
        return {
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={styles.customDropdown}>
                    <Input
                        style={styles.customDropdownInput}
                        ref={ele => (this.searchInput = ele)}
                        placeholder="Search name"
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={this.handleSearch(selectedKeys, confirm)}
                    />
                    <Button
                        style={styleMedia.customDropdownButton}
                        type="primary"
                        onClick={this.handleSearch(selectedKeys, confirm)}
                    >
                        Search
                    </Button>
                    <Button
                        style={styles.customDropdownButton}
                        onClick={this.handleReset(clearFilters)}
                    >
                        Reset
                    </Button>
                </div>
            ),
            filterIcon: filtered => <Icon type="filter" />,
            onFilter: filterFunction,
            onFilterDropdownVisibleChange: visible => {
                if (visible) {
                    setTimeout(() => {
                        this.searchInput.focus();
                    });
                }
            },
            render: text => {
                const { searchText } = this.state;
                return searchText ? (
                    <span>
                        {text
                            .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))
                            .map((fragment, i) =>
                                fragment.toLowerCase() === searchText.toLowerCase() ? (
                                    <span key={i} style={styleMedia.highlighted}>
                                        {fragment}
                                    </span>
                                ) : (
                                    fragment
                                )
                            )}
                    </span>
                ) : (
                    text
                );
            },
            sorter: (a, b) => a[key].localeCompare(b[key])
        };
    };
    prettifyTimeStamp = timestamp => {
        if (timestamp) {
            return moment(timestamp).format('YYYY-MM-DD');
        } else {
            return 'N/A';
        }
    };
    handleView = e => {
        this.setState({
            view: e.target.value
        });
    };
    handleReset = clearFilters => () => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    checkOverdue = (expectedReturn, return_ts) => {
        return moment().isAfter(moment(expectedReturn, 'YYYY-MM-DD')) && return_ts == 'N/A';
    };

    render() {
        let shownData = this.state.transactions;
        if (this.state.view === 'overdue') {
            shownData = shownData.filter(el => {
                return el.overdue;
            });
        }
        const columns = [
            {
                title: 'Title',
                dataIndex: 'title',
                key: 'title',
                ...this.setCustomFilter('title', true)
            },
            {
                title: 'Type of Media',
                dataIndex: 'type',
                key: 'type',
                filters: [
                    {
                        text: 'Music',
                        value: 'Music'
                    },
                    {
                        text: 'Movie',
                        value: 'Movie'
                    },
                    {
                        text: 'Book',
                        value: 'Book'
                    }
                ],
                onFilter: (value, record) => record.type.indexOf(value) === 0
            },
            {
                title: 'Copy Identifier',
                dataIndex: 'copyname',
                key: 'copyname'
            },
            {
                title: 'Loaned by',
                dataIndex: 'username',
                key: 'username',
                ...this.setCustomFilter('username', true)
            },
            {
                title: 'Loaned on',
                dataIndex: 'loan_ts',
                key: 'loan_ts',
                ...this.setCustomFilter('loan_ts')
            },
            {
                title: 'Expected by',
                dataIndex: 'expectedReturn',
                key: 'expectedReturn',
                ...this.setCustomFilter('expectedReturn')
            },
            {
                title: 'Returned on',
                dataIndex: 'return_ts',
                key: 'return_ts',
                ...this.setCustomFilter('return_ts')
            }
        ];
        return (
            <Card>
                <Form style={styles.Form}>
                    <Form.Item>
                        <Radio.Group
                            defaultValue="All"
                            buttonStyle="solid"
                            onChange={this.handleView}
                        >
                            <Radio.Button defaultChecked value="All">
                                All
                            </Radio.Button>
                            <Radio.Button value="overdue">Overdue Loans</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Form>
                <Table style={styles.Table} columns={columns} dataSource={shownData} />
            </Card>
        );
    }
}
