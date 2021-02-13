import './App.css';
import { Component } from 'react';
import Web3 from 'web3';
import Appointment from './abis/Appointment.json';
import Layout from './components/layout'
import Patient from './Patient'
import Admin from './Admin'
class App extends Component {

  constructor() {
    super();
    this.state = {
      account: '',
      isAdmin: false,
      fees: 0,
      appointment: null,
      appointmentCount: 0,
      currentSlot: 0,
      mySlot: 0,
      myAppointment: null,
      appointments: [],
      loading: true
    }
  }

  async componentDidMount() {
    this.loadWeb3();
    this.loadContractData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      console.log('Install MetaMask extension to access the site!');
    }
  }

  async loadContractData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    const bal = await web3.eth.getBalance(accounts[0]);
    console.log(bal);
    const networkId = await web3.eth.net.getId();
    const networkData = Appointment.networks[networkId];
    if (networkData) {
      const appointment = new web3.eth.Contract(Appointment.abi, networkData.address);
      this.setState({ appointment });

      const isAdmin = await appointment.methods.isAdmin().call({ from: this.state.account });
      this.setState({ isAdmin });

      const currentSlot = await appointment.methods.currentSlotInProcess().call();
      this.setState({ currentSlot }); 

      const fees = await this.state.appointment.methods.fees().call();
      this.setState({ fees })

      if (isAdmin) {
        const appointmentCount = await appointment.methods.appointmentCount().call();
        this.setState({ appointmentCount });

        for (var i = 1; i <= appointmentCount; i++) {
          const apt = await appointment.methods.appointments(i).call();
          this.setState({ appointments: [...this.state.appointments, apt] });
        }
      } else {
        const mySlot = await appointment.methods.getSlot().call({ from: this.state.account });
        const myAppointment = await appointment.methods.appointments(mySlot).call();
        this.setState({ mySlot, myAppointment }); 
      } 
      this.setState({ loading: false })

    } else {
      window.alert('Appointment contract not deployed to this network')
    }
  }

  refreshPage = () => {
    window.location.reload(false);
  }

  createAppointment = async () => {
    this.state.appointment.methods.createAppointment()
      .send({ from: this.state.account, value: this.state.fees })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
        this.refreshPage();
      })
  };

  startAppointment = async (index, zoomLink) => {
    console.log(index, zoomLink);
    this.setState({ loading: true })
    const apt = this.state.appointments[index];
    this.state.appointment.methods.markInProgress(apt.patient, apt.slot, zoomLink)
      .send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
        this.refreshPage();
      })
  }

  endAppointment = async (index) => {
    this.setState({ loading: true })
    const apt = this.state.appointments[index];
    this.state.appointment.methods.closeAppointment(apt.patient, apt.slot)
      .send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
        this.refreshPage();
      })
  }

  finishAppointments = async () => {
    this.setState({ loading: true })
    this.state.appointment.methods.completeAppointments()
      .send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
        this.refreshPage();
      })
  }

  setFees = async (fees) => {
    this.setState({ loading: true })
    this.state.appointment.methods.setfees(fees)
      .send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false }) 
      })
  }
 
  render() {
    return (
      this.state.loading ? null: 
      <Layout account={this.state.account} >
 
        <br></br>
        <div className="container">
          {
            this.state.isAdmin ?
              <Admin 
                setFees={this.setFees}
                appointmentCount={this.state.appointmentCount}
                appointments={this.state.appointments}
                fees={this.state.fees}
                finishAppointments={this.finishAppointments}
                startAppointment={this.startAppointment}
                endAppointment={this.endAppointment}
              />
              :
              <Patient
                mySlot={this.state.mySlot}
                myAppointment={this.state.myAppointment}
                currentSlot={this.state.currentSlot}
                createAppointment={this.createAppointment}
              />
          }

        </div>

      </Layout>
    );
  }
}
export default App;
