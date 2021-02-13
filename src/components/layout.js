import React from 'react';
import Header from './header'
import Footer from './footer' 
import 'semantic-ui-css/semantic.min.css';

export default (props) => {
    return (
        <div className="h-100 ">
            <Header account={props.account} />
            <br></br>
            <h4 className="text-center text-secondary">Ethereum based appointment system</h4>
            {props.children}
            <Footer />
        </div>
    )
};