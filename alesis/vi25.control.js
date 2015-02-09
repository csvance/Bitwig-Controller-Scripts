loadAPI(1);

host.defineController("Generic", "Alesis VI25", "1.0", "784546c4-ace0-11e4-89d3-123b93f75cba", "Carroll Vance");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["VI25"], ["VI25"]);

var LOWEST_CC = 1;
var HIGHEST_CC = 119;


function ccCode(cc){
	return cc-1;
}

var CC =
{
	PLAY : ccCode(119),
	STOP : ccCode(118),
	RECORD : ccCode(114),
	FORWARD : ccCode(116),
	REVERSE : ccCode(117),
	LOOP : ccCode(115),
}


var transport;

function ucIndex(cc){
	return cc - LOWEST_CC;  
}

function onMidi(status, data1, data2) {	
	
   if (isChannelController(status)) {
   
      if (data1 >= LOWEST_CC && data1 <= HIGHEST_CC) {

         var index = data1 - LOWEST_CC;
		 
		 if(index >= CC.RECORD && index <= CC.PLAY && data2 == 0){
		 
			switch(index){
				case CC.PLAY:
					transport.play();
					break;
				case CC.STOP:
					transport.stop();
					break;
				case CC.FORWARD:
					transport.fastForward();
					break;
				case CC.REVERSE:
					transport.rewind();
					break;
				case CC.LOOP:
					transport.toggleLoop();
					break;
				case CC.RECORD:
					transport.record();
					break;
					
			}
			
		 }
		 
		userControls.getControl(ucIndex(index)).set(data2, 128);
		 
		}
	}
	
}

function exit() {
}

function init() {

	
	VI25Input  = host.getMidiInPort(0).createNoteInput("Omni", "??????");
	VI25Input.setShouldConsumeEvents(false);
	VI25Input.assignPolyphonicAftertouchToExpression(0,NoteExpression.TIMBRE_UP, 5);

	// Setting Callbacks for Midi
	host.getMidiInPort(0).setMidiCallback(onMidi);
	
	//Send MIDI Clock
	host.getMidiOutPort(0).setShouldSendMidiBeatClock(true);

	transport = host.createTransport();

	// Make CCs 2-119 freely mappable
	userControls = host.createUserControlsSection((HIGHEST_CC - LOWEST_CC + 1));

	for(var i=LOWEST_CC; i<=HIGHEST_CC; i++)
	{
		userControls.getControl(i - LOWEST_CC).setLabel("CC " + i + " - Channel " + j);
	}
	
}