var socket = require('socket.io-client')('http://192.168.1.209:5555');
const Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO

const POWER = new Gpio(4, 'out'); //use GPIO pin 4 as output
const TEMP = new Gpio(3, 'out'); //use GPIO pin 3 as output


var heaterOn = false;

// Trun off relays (1 is LOW/off for the relays I have)
POWER.writeSync(1, function (err) {
});
TEMP.writeSync(1, function (err) {
});

// on connection to server
socket.on("connect", function () {
  console.log("Connected to server");


  // socket.emit('storeClientInfo', { customId: "pi-relay-1" });

  // socket.on('getStatus', function () {
  //   console.log('gotStatus');
  //   socket.emit('currentRelayState', RELAY.readSync());
  // })

});


// the web interface has signaled to change turn the pi on or off
socket.on('updateRelayState', function (newRelayState) {

  // only change relay if new relay state is different from what is the current relay state on the client-pi
  // if (newRelayState != POWER.readSync()) {
  if (newRelayState == 0 && !heaterOn) {
    // send new state to relay

    // turn heater on
    POWER.writeSync(0, function (err) {
    });
    sleep(100);
    POWER.writeSync(1, function (err) {
    });
    sleep(100);
    heaterOn = true;

    console.log("RELAY STATE", newRelayState);

    // if relay is set to on, turn temp down to 65 
    if (newRelayState == 0) {
      for (var i = 0; i < 21; i++) {
        TEMP.writeSync(0, function (err) {
        });
        sleep(50);
        TEMP.writeSync(1, function (err) {
        });
        sleep(50);

      }
    }

  } else {
    // turn heater off
    POWER.writeSync(0, function (err) {
    });
    sleep(100);
    POWER.writeSync(1, function (err) {
    });
    sleep(100);
    heaterOn = false;

  }
});

function sleep(sleepDuration) {
  var now = new Date().getTime();
  while (new Date().getTime() < now + sleepDuration) { /* do nothing */ }
}
socket.on('disconnect', function () {
  // RELAY.write(1);
  console.log('disconnected');
});
socket.on('currentRelayState', function (currentRelayState) {
  currentRelayState('Current relay state sent!');
});