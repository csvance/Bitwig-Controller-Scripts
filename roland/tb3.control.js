loadAPI(1);

host.defineController("Generic", "Roland TB-3", "1.0", "e3a3b5e0-b041-11e4-ab7d-12e3f512a338", "Carroll Vance");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["TB-3"], ["TB-3"]);

var LOWEST_CC = 1;
var HIGHEST_CC = 119;


function ccCode(cc){
	return cc-1;
}

var transport;

function ucIndex(channel, cc){
	return cc - LOWEST_CC + (channel) * (HIGHEST_CC-LOWEST_CC+1);  
}

function onMidi(status, data1, data2) {	
	
	printMidi(status, data1, data2);
   if (isChannelController(status)) {

	  var channel = status & 0x0F;
   
		if (data1 >= LOWEST_CC && data1 <= HIGHEST_CC) {
			var index = data1 - LOWEST_CC;
			userControls.getControl(ucIndex(channel,index)).set(data2, 128);
		}
		 
		
	}
	
}

function onSysex(data) {

}

function exit() {

}

function init() {
	VI25Input  = host.getMidiInPort(0).createNoteInput("Omni", "??????");
	VI25Input.setShouldConsumeEvents(false);

	// Setting Callbacks for Midi and Sysex
	host.getMidiInPort(0).setMidiCallback(onMidi);
	host.getMidiInPort(0).setSysexCallback(onSysex);

	//Send MIDI Clock
	host.getMidiOutPort(0).setShouldSendMidiBeatClock(true);

	transport = host.createTransport();

	  // Make CCs 2-119 freely mappable for all 16 Channels
	userControls = host.createUserControlsSection((HIGHEST_CC - LOWEST_CC + 1)*16);

	for(var i=LOWEST_CC; i<=HIGHEST_CC; i++)
	{
		for (var j=1; j<=16; j++) {
			userControls.getControl(i - LOWEST_CC).setLabel("CC " + i + " - Channel " + j);
		}
	}
	
}