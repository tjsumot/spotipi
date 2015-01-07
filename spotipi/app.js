var http = require('http').Server();
var io = require('socket.io')(http);

io.of('spotify').on('connection', function(socket) {
  socket.emit('spotify~run', "Hello!");
});

http.listen(3000, function() {
  console.log("listening on :3000");
});
