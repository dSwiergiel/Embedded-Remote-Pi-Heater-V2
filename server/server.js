var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const port = 5555;

// serve the pi controller page on get request
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/login.html');
});
app.get('/heatcontroller', function (req, res) {
    res.sendFile(__dirname + '/heatcontroller.html');
});


io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('stateChanged', function (state) {
        console.log("NEW RELAY STATE:", state)

        socket.broadcast.emit('updateRelayState', state);
    })
});


http.listen(port, function () {
    console.log('listening on:', port);
    console.log('App running at: http://localhost:' + port);
});