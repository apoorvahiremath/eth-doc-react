import React, { Component } from 'react';
import Identicon from 'identicon.js';
import './header.css'

class Header extends Component {

    render() {
        return (
            <div className="shadow mb-4 text-left text-white header" >
                <img src="/assets/images/logo/logo.png" alt="" className="float-left" height="50px" style={{ marginLeft: '50px' }} />

                <div className="row p-1">
                    <h2 className="col-8"><span style={{ opacity: 0.5 }}>Eth</span>Doc</h2>
                    <div className="col-4 pt-1">
                        {/* <p className="vertical-center mt-2">{this.props.account}</p> */}
                        <small className="text-white">
                            <span id="account">
                            {this.props.account}
                            </span>
                        </small>
                        {this.props.account
                            ? <img className='ml-2'
                                width='30'
                                height='30'
                                src={`data:image/png;base64,${new Identicon(this.props.account, 30).toString()}`}
                                />: null                
                            }
                    </div>
                </div>
            </div>

        )
    }
}

export default Header;