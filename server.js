const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)



const connectedUsers = {};
const userIds = [];
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/:room', (req, res) => {
  const roomId = req.params.room;
  const username = req.query.username || 'Guest'; // Default to 'Guest' if no username is provided
  res.render('room', { roomId, username });
});

io.on('connection', socket => {


  
  

  socket.on('join-room', (roomId, userId, username) => {
    if (!connectedUsers[roomId]) {
      connectedUsers[roomId] = [];
    }
    if (connectedUsers[roomId].length === 2){
      console.log('eror')
      socket.emit('room-full-error', { message: 'Room is full' });
    }else {
      socket.join(roomId);
      userIds.push(userId);
      io.to(roomId).emit('user-ids', userIds);
      socket.to(roomId).broadcast.emit('user-connected', userId, username);
      
      connectedUsers[roomId].push(username);
      console.log("users: " + connectedUsers[roomId]);
      io.to(roomId).emit('user-list', connectedUsers[roomId]);
  
    }
    
    
    socket.on('message', (message) => {
      io.to(roomId).emit('createMessage', { message, username });
    });

    socket.on('stop-share-screen',(video) => {
      console.log('Received stop-share-screen event from client')
      
      io.to(roomId).emit('stop-shared-screen',video); // Emit an event to all users to stop the shared screen
    });
    socket.on('add-share-id',(id) => {
      console.log('Received share ID:'+ id)
      
      io.to(roomId).emit('add-share-id-to-videogrid',id); // Emit an event to all users to stop the shared screen
    });
    socket.on('boolean',(bool) => {
      io.to(roomId).emit('receive-boolean',bool);
    })
    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId, username);
      if (connectedUsers[roomId]) {
        const index = connectedUsers[roomId].indexOf(username);
        if (index > -1) { 
          connectedUsers[roomId].splice(index, 1);
        }

        console.log("users: " + connectedUsers[roomId])
        io.to(roomId).emit('user-list', connectedUsers[roomId]);
      }
      if(userIds){
        const index1 = userIds.indexOf(userId);
        if (index1 > -1) { 
          userIds.splice(index1, 1);
        }
        io.to(roomId).emit('user-ids', userIds);
      }
    });
  });
  
});
server.listen(3000,()=>{
  console.log("listening on port 3000!")
})