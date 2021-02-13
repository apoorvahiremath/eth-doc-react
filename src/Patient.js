import { Component } from 'react';
import {Card, Button} from 'react-bootstrap';
class Patient extends Component {

    gotoZoomLink = () =>{
        window.open(this.props.myAppointment.zoomLink, "_blank") 
    }

    render() {
        return (
            <div>
                 <br />
            <br />
            {/* {this.props.mySlot == 0 ? */}
                <div className="text-center h-100 justify-content-center m-5">
                    <Card > 
                    <Card.Body>
                        <Card.Title>
                        {this.props.mySlot == 0 ?
                            <span>Take an appointment</span>
                            :
                            this.props.mySlot == this.props.currentSlot ?
                            <span>Your appointment is in process</span>
                            : <span>Your appointment status </span>
                        }
                        </Card.Title>
                        <Card.Text>
                        {this.props.mySlot == 0 ?
                            <span>Hurry up!!! Book your appointment at <b>EthDoc</b> by paying from your <b>Ethereum wallet</b>.</span>
                            : 
                            this.props.mySlot == this.props.currentSlot ?
                            <span>Please click on button below to consult the doctor.</span>
                            : <span>Your appointment slot is {this.props.mySlot}. Please wait... </span>
                        }
                        </Card.Text>
                        {this.props.mySlot == 0 ?
                        <button className="btn btn-success" onClick={this.props.createAppointment}>Click Here</button>
                        :
                        this.props.mySlot == this.props.currentSlot ?
                        <button className="btn btn-success" onClick={this.gotoZoomLink}>Join Zoom Meeting</button>
                            : null
                        }
                    </Card.Body>
                    </Card> 
                </div>
                {/* : */}
                {/* <div> 
                    <h5 className="text-center text-secondary">
                        {this.props.mySlot == this.props.currentSlot ?
                            <span>Your appointment is in process</span>
                            : <span>Your slot is {this.props.mySlot} </span>

                        }
                    </h5>
                </div> */}
                {/* } */}
            </div>
        )
    }
}

export default Patient;