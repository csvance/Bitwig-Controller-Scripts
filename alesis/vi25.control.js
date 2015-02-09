loadAPI(1);

host.defineController("Generic", "Alesis VI25", "1.0", "784546c4-ace0-11e4-89d3-123b93f75cba", "Carroll Vance");
host.defineMidiPorts(1, 0);
host.addDeviceNameBasedDiscoveryPair(["VI25"], []);

var LOWEST_CC = 1;
var HIGHEST_CC = 119;


function ccCode(cc){
	return cc-1;
}

const GLOBAL_CC_PLAY = ccCode(119);
const GLOBAL_CC_STOP = ccCode(118);
const GLOBAL_CC_RECORD = ccCode(114);
const GLOBAL_CC_FORWARD = ccCode(116);
const GLOBAL_CC_REVERSE = ccCode(117);
const GLOBAL_CC_LOOP = ccCode(115);

var globalCC = [GLOBAL_CC_PLAY,GLOBAL_CC_STOP,
				GLOBAL_CC_RECORD,GLOBAL_CC_FORWARD,
				GLOBAL_CC_REVERSE,GLOBAL_CC_LOOP];


var transport;

function ucIndex(channel, cc){
	return cc - LOWEST_CC + (channel) * (HIGHEST_CC-LOWEST_CC+1);  
}

function onMidi(status, data1, data2) {	
	
   if (isChannelController(status)) {

	  var channel = status & 0x0F;
   
      if (data1 >= LOWEST_CC && data1 <= HIGHEST_CC) {

         var index = data1 - LOWEST_CC;
		 
		 if(globalCC.indexOf(index) != -1 && data2 == 0){
			if(index == GLOBAL_CC_PLAY){
				transport.play();
			}else if(index == GLOBAL_CC_STOP){
				transport.stop();
			}else if(index == GLOBAL_CC_FORWARD){
				transport.fastForward();
			}else if(index == GLOBAL_CC_REVERSE){
				transport.rewind();
			}else if(index == GLOBAL_CC_LOOP){
				transport.toggleLoop();
			}else if(index == GLOBAL_CC_RECORD){
				transport.record();
			}
			
			
		 }
		 
		userControls.getControl(ucIndex(channel,index)).set(data2, 128);
		 
		}
	}
	
}

function onSysex(data) {
	//printSysex(data);
}

function exit() {
   // nothing to do here ;-)
}

function init() {

	
	VI25Input  = host.getMidiInPort(0).createNoteInput("Omni", "??????");
	VI25Input.setShouldConsumeEvents(false);
	VI25Input.assignPolyphonicAftertouchToExpression(0,NoteExpression.TIMBRE_UP, 5);

	// Setting Callbacks for Midi and Sysex
	host.getMidiInPort(0).setMidiCallback(onMidi);
	host.getMidiInPort(0).setSysexCallback(onSysex);

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