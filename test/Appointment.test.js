const { assert } = require('chai');


require('chai')
    .use(require('chai-as-promised'))
    .should()

const Appointment = artifacts.require("Appointment");


contract('Appointment', ([deployer, patient1, patient2]) =>{
    let appointment;    
    console.log(deployer, patient1, patient2);
    before(async()=>{
        appointment = await Appointment.deployed();
    })

    describe('deploy', async()=>{
        it('deployed successfully', async()=>{
            const address = await appointment.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        })
        it('has name', async()=>{
            const name = await appointment.name();
            assert.equal(name, "Doctor's Appointment");
        })
        it('has maxAppointments', async()=>{
            const maxAppointments = await appointment.maxAppointments();
            assert.equal(maxAppointments, 5);
        })
        it('has fees', async()=>{
            const fees = await appointment.fees();
            assert.equal(fees, 1000000000);
        })
    })

    describe('admin operations', async()=>{
        it('check is admin', async()=>{
            const result = await appointment.isAdmin({from: deployer});
            assert.equal(result, true);
        })
        it('check is not admin', async()=>{
            const result = await appointment.isAdmin({from: patient1});
            assert.equal(result, false);
        })
        it('set fees by admin should update the fees', async()=>{
            await appointment.setfees(web3.utils.toWei('0.001', 'Ether'), {from: deployer}); 
            const fees = await appointment.fees();
            assert.equal(fees, web3.utils.toWei('0.001', 'Ether'));
        })
        it('set fees by non admin should fail', async()=>{
            await appointment.setfees(web3.utils.toWei('0.001', 'Ether'), {from: patient1}).should.be.rejected;
        })
    })

    describe('appointment process', async()=>{
        it('create appointment', async()=>{
            //owner cannot creat appointment
            await appointment.createAppointment({from: deployer, value: web3.utils.toWei('0.01', 'Ether')}).should.be.rejected;
            // lower fees will ne rejected
            await appointment.createAppointment({from: patient1, value: web3.utils.toWei('0.000001', 'Ether')}).should.be.rejected;
            // Success
            const result = await appointment.createAppointment({from: patient1, value: web3.utils.toWei('0.001', 'Ether')});
            const event = result.logs[0].args; 
            assert.equal(event.paitent, patient1);
            assert.equal(event.slot.toNumber(), 1);
            // Same patient cannot opt for multiple appointments
            await appointment.createAppointment({from: patient1, value: web3.utils.toWei('0.001', 'Ether')}).should.be.rejected;

        })

        it('get my slot', async()=>{
            const slot = await appointment.getSlot({from: patient1});
            assert.equal(slot, 1);
        })

        it('mark in process appointment', async()=>{
            // Should fail for non admin 
            await appointment.markInProgress(patient1, 1, "Link", {from: patient2}).should.be.rejected;
            // Should fail for non registered patient
            await appointment.markInProgress(patient2, 1, "Link", {from: deployer}).should.be.rejected;
            // Should fail for patient and slot mismatch
            await appointment.markInProgress(patient2, 2, "Link", {from: deployer}).should.be.rejected;
            // Success
            const result = await appointment.markInProgress(patient1, 1, "Link", {from: deployer});
            const event = result.logs[0].args;
            assert.equal(event.patient , patient1);
            assert.equal(event.slot , 1);
            assert.equal(event.zoomLink , "Link");

            const currentSlot = await appointment.currentSlotInProcess();
            assert.equal(currentSlot.toNumber() , 1);

        })

        it('close appointment', async()=>{
            // Should fail if tried closing open appointment
            await appointment.closeAppointment(patient1, 3, {from: deployer}).should.be.rejected;
            // Should fail for non registered patient
            await appointment.closeAppointment(patient2, 1, {from: deployer}).should.be.rejected;
            // Success
            const result = await appointment.closeAppointment(patient1, 1, {from: deployer});
            const event = result.logs[0].args;  

            assert.equal(event.paitent, patient1);
            assert.equal(event.slot.toNumber(), 1);

            const appointmentCount  = await appointment.appointmentCount();
            assert.equal(appointmentCount.toNumber() , 0);
        })
    })

    describe('wind up', async()=>{
        it('complete appointments', async()=>{
            await appointment.completeAppointments();
            let appointmentCount = await appointment.appointmentCount();
            assert.equal(appointmentCount, 0);
        })
    })

})