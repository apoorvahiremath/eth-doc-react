const Appointment = artifacts.require('Appointment');

module.exports = function(deployer) {
    deployer.deploy(Appointment, 5, 1000000000000000);
}