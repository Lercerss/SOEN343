import React from 'react';
import { Modal } from 'antd';

export default class EditTimer extends React.Component {
   
    state = {
        minutesLeft:'10',
        secondsLeft:'00',
    }

    style = {
        timer: {
            textAlign: 'right',
            paddingRight: '25px'
        }
    }
    componentDidMount = () => {
        this.setTimer();
    }
    componentDidUpdate = (prevProps) => {
        if (!this.props.isEditFormShown){
            this.stop();
        } else if (this.props.lockedAt !== prevProps.lockedAt){
            this.setTimer();
        }
    }

    setTimer = () => {
        this.interval = setInterval(() => {
            const date = this.calculateCountdown(this.props.lockedAt);
            date ? this.setState({
                minutesLeft: date.min,
                secondsLeft: date.sec
            })
            : this.handleTimerDone()
        }, 1000);
    }

    handleTimerDone = () =>{
        Modal.error({
            title: 'Edit time expired',
            content: 
            `You have passed the 10 minutes allowance for editing this item. 
            Please close and re-open the form to edit once again.`
        });
        this.setState({
            minutesLeft:'00',
            secondsLeft:'00',
        });
        this.stop();
    }

    addLeadingWhitespace(num){
        if (num < 1) return '00';
        if (num < 10){
            return '0' + num;
        } else {
            return num + '';
        }
    }

    calculateCountdown(endDate) {
        let diff = (endDate + (10 * 60)) - parseInt(Date.now() / 1000); //in seconds

        if (diff <= 0) return false;

        const timeLeft = {
            min: '',
            sec: ''
        };

        if (diff >= 60) {
            var _minLeft = Math.floor(diff / 60); 
            diff -= _minLeft * 60;
            timeLeft.min = _minLeft + '';
        } else {
            timeLeft.min = '00'
        }

        timeLeft.sec = this.addLeadingWhitespace(diff);
        return timeLeft;
    }

    stop() {
        clearInterval(this.interval);
    }

    render(){
        return(
            <div style={this.style.timer}>
                <small>Time left for editing: &nbsp; {this.state.minutesLeft}:{this.state.secondsLeft}</small>
            </div>
        );
    }
}

EditTimer.defaultProps = {
    date: new Date()
};


