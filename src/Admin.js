import { Component } from 'react';
import { Table } from 'semantic-ui-react'
import { Modal, Button } from 'react-bootstrap'
import { PencilFill } from 'react-bootstrap-icons'

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showHide: false,
            showHide1: false,
            slot: 0
        }
    }

    handleModalShowHide = (index) => {
        this.setState({ showHide: !this.state.showHide, slot: index })
    }

    handleModalShowHide1 = () => {
        this.setState({ showHide1: !this.state.showHide1 })
    }

    render() {
        const { Header, Row, HeaderCell, Body, Cell } = Table;

        return (
            <div>
                <div className="text-right">
                    <p>Appointment Fees <span className="badge badge-success p-2">{window.web3.utils.fromWei(this.props.fees, 'ether')} Eth</span>
                        {this.props.appointmentCount == 0 ? 
                        <button className="btn btn-sm btn-secondary ml-2" onClick={this.handleModalShowHide1}><PencilFill /></button> 
                        :  
                        <button className="btn btn-sm btn-secondary m-2" onClick={this.props.finishAppointments}>Finish Appointments</button>
}
                    </p>
                </div>

                {
                    this.props.appointmentCount > 0 ?
                        <div className="text-right">
                           
                            <Table>
                                <Header>
                                    <Row>
                                        <HeaderCell>Slot ID</HeaderCell>
                                        <HeaderCell>Paient</HeaderCell>
                                        <HeaderCell>Fees</HeaderCell>
                                        <HeaderCell>Status</HeaderCell>
                                        <HeaderCell>Mark In Process</HeaderCell>
                                        <HeaderCell>End Appointment</HeaderCell>
                                    </Row>
                                </Header>
                                <Body>
                                    {
                                        this.props.appointments.map((apt, index) => {
                                            return (
                                                <Row key={index} >
                                                    <Cell>{apt.slot}</Cell>
                                                    <Cell>{apt.patient}</Cell>
                                                    <Cell>{window.web3.utils.fromWei(this.props.fees, 'ether')} Eth</Cell>
                                                    <Cell>{apt.status == 0 ?
                                                        <span className="badge badge-primary">OPEN</span> :
                                                        apt.status == 1 ? <span className="badge badge-danger">IN PROCESS</span>
                                                            : <span className="badge badge-success">COMPLETE</span>}
                                                    </Cell>
                                                    <Cell>
                                                        {
                                                            apt.status == 0 ?
                                                                <button className="btn btn-sm btn-block btn-success" basic onClick={() => this.handleModalShowHide(index)}>Start</button> : null
                                                        }

                                                    </Cell>
                                                    <Cell>
                                                        {
                                                            apt.status == 1 ?
                                                                <button className="btn btn-sm btn-block btn-danger" basic onClick={() => this.props.endAppointment(index)}>End</button> : null
                                                        }
                                                    </Cell>
                                                </Row>
                                            )
                                        })
                                    }
                                </Body>
                            </Table>
                        </div>
                        :
                        <div className="h-100 justify-content-center my-5">

                            <div className="alert alert-info text-center">
                                No appointments registered.
                            </div>
                        </div>
                }

                <Modal show={this.state.showHide} onHide={this.handleModalShowHide}>
                    <Modal.Header closeButton>
                        <Modal.Title>Zoom Link</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={
                            (event) => {
                                event.preventDefault();
                                const content = this.link.value;
                                this.props.startAppointment(this.state.slot, content);
                                this.handleModalShowHide(0);
                            }
                        }>
                            <div className="form-group mr-sm-2">
                                <input
                                    id="link"
                                    type="text"
                                    className="form-control"
                                    placeholder="Set Zoom Link for this Appointment"
                                    required
                                    ref={(input) => { this.link = input }}
                                />

                                <button type="submit" className="btn btn-primary btn-block mt-2"  >Save</button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>

                <Modal show={this.state.showHide1} onHide={this.handleModalShowHide1}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Fees</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={
                            (event) => {
                                event.preventDefault();
                                const fee = window.web3.utils.toWei(this.newfees.value, 'ether');
                                this.props.setFees(fee);
                                this.handleModalShowHide1();
                            }
                        }>
                            <div className="form-group mr-sm-2">
                            <div class="input-group mb-3">
                                <input
                                    id="newfees"
                                    type="text"
                                    className="form-control"
                                    placeholder="Set Appointment Fees"
                                    required
                                    ref={(input) => { this.newfees = input }}
                                />
                                <span class="input-group-text" id="basic-addon2">Eth</span>
                            </div>
                                <button type="submit" className="btn btn-primary btn-block mt-2"  >Save</button>
                            </div>
                        </form>
                    </Modal.Body>

                </Modal>
            </div>
        )

    }
}

export default Admin;