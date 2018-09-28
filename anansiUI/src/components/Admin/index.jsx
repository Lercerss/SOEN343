import React from 'react';
import RegisterAdmin from './RegisterAdmin';

export default class Admin extends React.Component {

    render() {
        return(
            <div className='admin'> 
                <h1>Welcome Admin!</h1>
                <RegisterAdmin />
            </div>
        );
    }
}