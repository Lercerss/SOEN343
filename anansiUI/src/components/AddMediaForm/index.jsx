import React from 'react';
import { Radio, Form, Divider } from 'antd';
import MagazineForm from './../MagazineForm';
import MovieForm from './../MovieForm';
import MusicForm from './../MusicForm';
import BookForm from './../BookForm';

export default class MediaForm extends React.Component {
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
                sm: { span: 8 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 }
            }
        };

        const { token, handleClose } = this.props;

        const formComponent = {
            book: <BookForm action="insert" token={token} handleClose={handleClose} />,
            magazine: <MagazineForm action="insert" token={token} handleClose={handleClose} />,
            movie: <MovieForm action="insert" token={token} handleClose={handleClose} />,
            music: <MusicForm action="insert" token={token} handleClose={handleClose} />,
            undefined: ''
        };

        return (
            <div className="AddMediaForm modal-wrap">
                <Form className="MetaForm">
                    <div
                        className="Form_close"
                        onClick={handleClose}
                        onKeyPress={handleClose}
                        role="button"
                        tabIndex={0}
                    >
                        &#10005;
                    </div>
                    <Form.Item {...formItemLayout} label="Pick a media type:">
                        <Radio.Group buttonStyle="solid" onChange={this.handleView}>
                            <Radio.Button value="book">Book</Radio.Button>
                            <Radio.Button value="magazine">Magazine</Radio.Button>
                            <Radio.Button value="movie">Movie</Radio.Button>
                            <Radio.Button value="music">Music</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                </Form>
                <Divider />
                {formComponent[this.state.mediaType]}
            </div>
        );
    }
}
