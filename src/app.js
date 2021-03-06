// Client
require('dotenv').config();
var Blynk = require('blynk-library');
var socket = require('socket.io-client')(process.env.SERVER); // server running nodejs-poolController example: http://localhost:3000
var pin = require('./pinDefs');

var AUTH = process.env.API_KEY; // Add your 32 character blynk auth token or define in .env file as API_KEY
// console.log('API_KEY = ' + AUTH);
var blynk = new Blynk.Blynk(AUTH);

const vPinPoolSetPoint = new blynk.VirtualPin(pin.iTouchPoolSetPoint); // Pool Heater
const vChlorinatorSetPoint = new blynk.VirtualPin(pin.scgPercent)
const vPinCircuit2 = new blynk.VirtualPin(pin.circuit2); // Pool Lights
const vPinCircuit3 = new blynk.VirtualPin(pin.circuit3); // Aux Circuit #1
const vPinCircuit4 = new blynk.VirtualPin(pin.circuit4); // Aux Circuit #2
console.log('Circuit 2 = ' + pin.circuit2 + ' Circuit 3 = ' +pin.circuit3 + ' Circuit 4 = ' +pin.circuit2);
const vPinLightMode = new blynk.VirtualPin(pin.intellibriteMode); // Intellibrite Light Modes

// Blynk Widget to Pin Mapping
const term = new blynk.WidgetTerminal(pin.logTerminal);

socket.on('connect', function(){
	term.write('Successfully connected to pool controller' + '\n');
	console.log('Successfully connected to pool controller' + '\n');
});

// socket.on('all', function(){
// 	socket.emit('circuit'); // trying to get the controller to send us some circuit info.
// });

socket.on('temperature', function(data){
	// var poolTemp = Number(data.temperature.poolTemp);
	// var airTemp = Number(data.temperature.airTemp);
	// var poolSetPoint = Number(data.temperature.poolSetPoint);
	// var spaTemp = Number(data.temperature.spaTemp);
	// var spaSetPoint = Number(data.temperature.spaSetPoint);

	blynk.virtualWrite(pin.iTouchPoolTemp, Number(data.temperature.poolTemp));
	blynk.virtualWrite(pin.iTouchAirTemp, Number(data.temperature.airTemp));
	blynk.virtualWrite(pin.iTouchPoolSetPoint, Number(data.temperature.poolSetPoint));
	blynk.virtualWrite(pin.iTouchSpaTemp, Number(data.temperature.spaTemp));
	blynk.virtualWrite(pin.iTouchSpaSetPoint, Number(data.temperature.spaSetPoint));
});

socket.on('time', function(data){
	controllerTimeStr = data.time.controllerTime + ' - ' + data.time.controllerDateStr;
	blynk.virtualWrite(pin.iTouchDateTime, controllerTimeStr);
	
	term.write(controllerTimeStr + '\n');
	console.log(controllerTimeStr);
    // console.log(data.time.controllerTime);
    // socket.emit('echo');
});


socket.on('pump', function(data){
	var pumpData = data.pump

	for (i = 0; i < Object.keys(data.pump).length; i++) {
		blynk.virtualWrite(pin.pump[i].watts, data.pump[i+1].watts);
		blynk.virtualWrite(pin.pump[i].rpm, data.pump[i+1].rpm);
		blynk.virtualWrite(pin.pump[i].gpm, data.pump[i+1].gpm);
		var pumpLed = new blynk.WidgetLED(pin.pump[i].status);

		if (data.pump[i+1].run == 10) {
			blynk.setProperty(pin.pump[i].status, 'color', '#23C48E')
			pumpLed.turnOn();
		} else { 
			blynk.setProperty(pin.pump[i].status, 'color', '#D3435C')
			pumpLed.turnOn();
		}
	}
	
});

socket.on('circuit', function(data){
	
	var circuit2 = Number(data.circuit['2'].status);
	var circuit3 = Number(data.circuit['3'].status);
	var circuit4 = Number(data.circuit['4'].status);
	// add more per your system requirements

	blynk.virtualWrite(pin.circuit2, circuit2);
	// blynk.virtualWrite(pin.intellibriteMode, circuit2); // updates Intellibrite status on blynk UI
	blynk.virtualWrite(pin.circuit3, circuit3);
	blynk.virtualWrite(pin.circuit4, circuit4);
	// map additional circuits above to virtual pins
	
});

socket.on('chlorinator', function(data){
	blynk.virtualWrite(pin.scgSalt, data.chlorinator.saltPPM + ' PPM');
	blynk.virtualWrite(pin.scgPercent, data.chlorinator.outputPoolPercent + '%');
	blynk.virtualWrite(pin.scgStatus, data.chlorinator.status);
	// blynk.virtualWrite(pin.scgSuperChlorinate, data.chlorinator.superChlorinate);
	blynk.virtualWrite(pin.scgSuperChlorinateHours, data.chlorinator.superChlorinateHours + ' Hours');
	data.chlorinator.superChlorinate ? blynk.virtualWrite(pin.scgSuperChlorinate, 'True') : blynk.virtualWrite(pin.scgSuperChlorinate, 'False'); 
});

// Listen for events
vPinPoolSetPoint.on('write', function(data) {
  term.write('Heater SetPoint:' + Number(data) + '\n');
  socket.emit('setPoolSetPoint', Number(data));
  // blynk.notify('Temp setpoint changed' + data);
});
vChlorinatorSetPoint.on('write', function(data) {
  term.write('Chlorinator SetPoint:' + Number(data) + '\n');
  socket.emit('setchlorinator', Number(data), 0, 0);
  // setchlorinator(poolLevel, spaLevel, superChlorinateHours)
});

vPinCircuit2.on('write', function(data) {
	term.write('Pool Lights toggle \n');
  socket.emit('toggleCircuit', 2);
});
vPinCircuit3.on('write', function(data) {
	term.write('Circuit 3 toggle \n');
  socket.emit('toggleCircuit', 3);
});
vPinCircuit4.on('write', function(data) {
	term.write('Circuit 4 toggle \n');
  socket.emit('toggleCircuit', 4);
});

vPinLightMode.on('write', function(data) {
	switch(Number(data)) {
		case 1: // off
			socket.emit('setLightMode', 0);
			term.write('Lights set to off\n');
		break;
		case 2: // on
			socket.emit('setLightMode', 1);
			term.write('Lights set to on\n');
		break;
		case 3: // color sync
			socket.emit('setLightMode', 128);
			term.write('Lights set to color sync\n');
		break;
		case 4: // color swim
			socket.emit('setLightMode', 144);
			term.write('Lights set to color swim\n');
		break;
		case 5: // color set
			socket.emit('setLightMode', 160);
			term.write('Lights set to color set\n');
		break;
		case 6: // color save
			socket.emit('setLightMode', 190);
			term.write('Lights mode saved\n');
		break;
		case 7: // color recall
			socket.emit('setLightMode', 191);
			term.write('Lights mode set to recall\n');
		break;
		case 8: // white
			socket.emit('setLightMode', 196);
			term.write('Lights set to white\n');
		break;
		case 9: // green
			socket.emit('setLightMode', 194);
			term.write('Lights set to green\n');
		break;
		case 10: // blue
			socket.emit('setLightMode', 193);
			term.write('Lights set to blue\n');
		break;
		case 11: // red
			socket.emit('setLightMode', 195);
			term.write('Lights set to red\n');
		break;
		case 12: // magenta
			socket.emit('setLightMode', 197);
			term.write('Lights set to magenta\n');
		break;
		case 13: // party mode
			socket.emit('setLightMode', 177);
			term.write('Lights set to party mode\n');
		break;
		case 14: // romance mode
			socket.emit('setLightMode', 178);
			term.write('Lights set to romance mode\n');
		break;
		case 15: // caribbean mode
			socket.emit('setLightMode', 179);
			term.write('Lights set to caribbean mode\n');
		break;
		case 16: // american mode
			socket.emit('setLightMode', 180);
			term.write('Lights set to merica mode\n');
		break;
		case 17: // sunset mode
			socket.emit('setLightMode', 181);
			term.write('Lights set to sunbet mode\n');
		break;
		case 18: // royal mode
			socket.emit('setLightMode', 182);
			term.write('Lights set to royal mode\n');
		break;
		default: // got something else, just turn the lights off.
			socket.emit('setLightMode', 0);
			term.write('default, lights set to off\n');
	}
  });

socket.on('disconnect', function(){
	term.write('Connection to pool controller disconnected' + '\n');
	console.log('Connection to pool controller disconnected' + '\n');
});