loadAPI(1);

host.defineController("Generic", "Roland TB-3", "1.0", "e3a3b5e0-b041-11e4-ab7d-12e3f512a338", "Carroll Vance");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["TB-3"], ["TB-3"]);

var LOWEST_CC = 1;
var HIGHEST_CC = 119;

function ucIndex(cc){
	return cc - LOWEST_CC;  
}

function onMidi(status, data1, data2) {	
	
   if (isChannelController(status)) {

		if (data1 >= LOWEST_CC && data1 <= HIGHEST_CC) {
			var index = data1 - LOWEST_CC;
			userControls.getControl(ucIndex(index)).set(data2, 128);
		}
		  
		
	}
	
}

function exit() {

}

function init() {
	VI25Input  = host.getMidiInPort(0).createNoteInput("Omni", "??????");
	VI25Input.setShouldConsumeEvents(false);

	// Setting Callbacks for Midi
	host.getMidiInPort(0).setMidiCallback(onMidi);


	//Send MIDI Clock
	host.getMidiOutPort(0).setShouldSendMidiBeatClock(true);

	// Make CCs 2-119 freely mappable
	userControls = host.createUserControlsSection((HIGHEST_CC - LOWEST_CC + 1));

	for(var i=LOWEST_CC; i<=HIGHEST_CC; i++)
	{
		userControls.getControl(i - LOWEST_CC).setLabel("CC " + i + " - Channel " + j);
	}
	
}