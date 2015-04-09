loadAPI(1);

host.defineController("Generic", "Alesis VI25", "1.0", "784546c4-ace0-11e4-89d3-123b93f75cba", "Carroll Vance");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["VI25"], ["VI25"]);

var LOWEST_CC = 1;
var HIGHEST_CC = 119;

var CC =
{
	PLAY : 118,
	STOP : 117,
	RECORD : 113,
	FORWARD : 115,
	REVERSE : 116,
	LOOP : 114,
	K1 : 19,
	K2 : 20,
	K3 : 21,
	K4 : 22,
	K5 : 23,
	K6 : 24,
	K7 : 25,
	K8 : 26,
}

function isInDeviceParametersRange(cc)
{
	return cc >= CC.K1 && cc <= CC.K8;
}

function ucIndex(cc){
	return cc - LOWEST_CC;  
}

var transport;

function onMidi(status, data1, data2) {	
	printMidi(status, data1, data2);
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
			
			} else if(isInDeviceParametersRange(index)){
				var macro_index = data1 - CC.K1 - 1 ;
				primaryInstrument.getMacro(macro_index).getAmount().set(data2, 128);
			}else{
				userControls.getControl(ucIndex(index)).set(data2, 128);
			}
		
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
	
	cursorDevice = host.createEditorCursorDevice();
	cursorTrack = host.createArrangerCursorTrack(3, 0);
	primaryInstrument = cursorTrack.getPrimaryInstrument();

	// Make CCs 2-119 freely mappable
	userControls = host.createUserControlsSection((HIGHEST_CC - LOWEST_CC + 1));

	for(var i=LOWEST_CC; i<=HIGHEST_CC; i++)
	{
		userControls.getControl(i - LOWEST_CC).setLabel("CC " + i);
	}
	
}