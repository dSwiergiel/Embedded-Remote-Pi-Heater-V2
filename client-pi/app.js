var socket = require('socket.io-client')('http://192.168.1.209:5555');
const Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO

const POWER = new Gpio(4, 'out'); //use GPIO pin 4 as output
const TEMP = new Gpio(3, 'out'); //use GPIO pin 3 as output
// Trun off relays
POWER.writeSync(1, function (err) {
});
TEMP.writeSync(1, function (err) {
});

// on connection to server
socket.on("connect", function () {
  console.log("Connected to server");


  socket.emit('storeClientInfo', { customId: "pi-relay-1" });

  socket.on('getStatus', function () {
    console.log('gotStatus');
    socket.emit('currentRelayState', RELAY.readSync());
  })

});

socket.on('updateRelayState', function (newRelayState) {

  // if (newRelayState != POWER.readSync()) { //only change relay if status has changed
  // send new state to relay
  // POWER.writeSync(newRelayState, function (err) {

  //   // if error, turn relay off
  //   if (err) {
  //     // RELAY.write(1);
  //     socket.emit('updateStateFailure', err);
  //   } else {// else emit current state


  //     socket.emit('updatedRelayState', RELAY.readSync());
  //   }
  // }); //turn relay on or off
  POWER.writeSync(0, function (err) {
  });
  sleep(100);
  POWER.writeSync(1, function (err) {
  });
  sleep(100);

  if (newRelayState == 0) {
    for (var i = 0; i < 21; i++) {
      TEMP.writeSync(0, function (err) {
      });
      sleep(50);
      console.log(TEMP.readSync())
      TEMP.writeSync(1, function (err) {
      });
      sleep(50);

    }
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
})