import React from 'react';
import { Radio, Form, Divider, Card } from 'antd';
import MediaForm from './../MediaForm';

export default class AddMediaForm extends React.Component {
    state = {
        mediaType: undefined
    };

    handleView = e => {
        this.setState({ mediaType: e.target.value });
    };

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 3 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 10 }
            }
        };
        const { handleClose } = this.props;

        return (
            <Card>
                <b>Pick a media type : </b>
                <Radio.Group buttonStyle="solid" onChange={this.handleView}>
                    <Radio.Button value="Book">Book</Radio.Button>
                    <Radio.Button value="Magazine">Magazine</Radio.Button>
                    <Radio.Button value="Movie">Movie</Radio.Button>
                    <Radio.Button value="Music">Music</Radio.Button>
                </Radio.Group>
                <Divider />
                <MediaForm
                    type={this.state.mediaType}
                    action="insert"
                    handleClose={handleClose}
                />
            </Card>
        );
    }
}
