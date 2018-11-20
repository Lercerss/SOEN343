import React from 'react';
import { Modal, Table, Button, Input, Icon } from 'antd';
import { getTransactions } from '../../utils/httpUtils';
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
    }
};
export default class Transactions extends React.Component {
    state = {
        transactions: []
    };

    componentDidMount() {
        getTransactions()
            .then(res => {
                console.log(res);
                let tableData = res.map(el => {
                    return {
                        key: el.id,
                        title: el.item_info.title,
                        loan_ts: el.loan_ts,
                        return_ts: el.return_ts,
                        expectedReturn: el.expectedReturn,
                        type: el.item_type
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

    handleReset = clearFilters => () => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    render() {
        const columns = [
            {
                title: 'Title',
                dataIndex: 'title',
                key: 'title',
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
                onFilter: (value, record) =>
                    record.title.toLowerCase().includes(value.toLowerCase()),
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
                sorter: (a, b) => a.title.localeCompare(b.title)
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
                title: 'Loaned on',
                dataIndex: 'loan_ts',
                key: 'loan_ts'
            },
            {
                title: 'Expected by',
                dataIndex: 'expectedReturn',
                key: 'expectedReturn'
            },
            {
                title: 'Returned on',
                dataIndex: 'return_ts',
                key: 'return_ts'
            }
        ];
        return <Table columns={columns} dataSource={this.state.transactions} />;
    }
}
