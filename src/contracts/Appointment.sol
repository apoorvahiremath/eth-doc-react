// SPDX-License-Identifier: AJH
pragma solidity ^0.7.4;

contract Appointment{

    string public name = "Doctor's Appointment"; 
    
    address payable owner;

    uint public maxAppointments;
    uint public fees;
    uint public appointmentCount;
    uint public currentSlotInProcess;

    mapping(uint => AllocatedSlot) public appointments;
    mapping(address => uint) private isAppointed;

    enum SlotStatus {OPEN, INPROCESS, COMPLETE}

    struct AllocatedSlot{
        uint slot;
        address patient; 
        string zoomLink;
        SlotStatus status;
    }

    event CreateAppointment(
        address indexed paitent,
        uint slot 
    );

    event MarkedInProgress(
        address indexed patient,
        uint slot, 
        string zoomLink
    );

    event CloseAppointment(
        address indexed paitent,
        uint slot 
    );
 
    modifier restricted(){
        require(msg.sender == owner);
        _;
    }

    constructor(uint _maxAppointments, uint _fees){
        owner = msg.sender;
        maxAppointments = _maxAppointments;
        fees = _fees;
    }

    function setfees(uint _fees) public restricted{
        fees = _fees;
    }

    function isAdmin() public view returns(bool){ 
        return (msg.sender == owner);
    }

    function createAppointment() public payable {
        require(msg.sender != owner);
        require(isAppointed[msg.sender] == 0); 
        require(appointmentCount < maxAppointments);
        require(msg.value == fees);

        appointmentCount++;
        appointments[appointmentCount] = AllocatedSlot(appointmentCount, msg.sender, '', SlotStatus.OPEN);
        isAppointed[msg.sender] = appointmentCount;

        emit CreateAppointment(msg.sender, appointmentCount);
 
    }
    
    function getSlot() public view returns(uint){ 
        return isAppointed[msg.sender];
    }

    function markInProgress(address _patient, uint _slot, string memory _zoomLink) public restricted{
        require(isAppointed[_patient] == _slot); 
        require(appointments[_slot].patient == _patient);
        if(_slot-1 != 0){
            require(appointments[_slot-1].status == SlotStatus.COMPLETE);
        }

        AllocatedSlot memory _allocatedSlot = appointments[_slot];
        _allocatedSlot.status = SlotStatus.INPROCESS;
        _allocatedSlot.zoomLink = _zoomLink;
        appointments[_slot] = _allocatedSlot;
        currentSlotInProcess = _slot;

        emit MarkedInProgress(_patient, _slot, _zoomLink);
    }

    function closeAppointment(address _patient,uint _slot) public{
        require(currentSlotInProcess == _slot); 
        require(isAppointed[_patient] == _slot); 
        require(appointments[_slot].patient == _patient);
        require(appointments[_slot].status == SlotStatus.INPROCESS);

        appointments[_slot].status = SlotStatus.COMPLETE;
        delete isAppointed[_patient];
        // delete appointments[_slot];
        // appointmentCount --;

        emit CloseAppointment(_patient, _slot);
    }

    function completeAppointments() public restricted{
        require(appointmentCount == currentSlotInProcess);
        owner.transfer(fees*appointmentCount);
        appointmentCount = 0;
        currentSlotInProcess = 0;
    }
 
}