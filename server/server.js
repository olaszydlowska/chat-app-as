const app = require('express')();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {origin : '*'}
});
const port = process.env.PORT || 3000;
let connectedCounter = 0;

io.on("connect", (socket) => {
  let user;
  
  console.log(`Connected client on port ${port}`);
  
  socket.on("connected", (u) => {
    user = u;
    connectedCounter++;
    io.emit('getUsersCount',connectedCounter)
  })
  
  socket.on("message", (message) => {
    console.log( `[Server] Message received: ${JSON.stringify(message)}`);
    io.emit("message", message);
  });

  socket.on("typing", (user) => {
    socket.broadcast.emit('typing', user);
  });

  socket.on("stopTyping", (user) => {
    socket.broadcast.emit('stopTyping', user);
  });

  socket.on("disconnect", () => {
    if(connectedCounter > 0){
          connectedCounter--;
    }
    console.log("Client disconnected", user);
    io.emit('getUsersCount',connectedCounter)
    io.emit('disconnected', user)
  });
});

httpServer.listen(port, () => console.log(`Listening on port ${port}`));

