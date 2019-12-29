const path = require('path');
const express = require('express');
const app = express();

const socketIO = require('socket.io');

//settings
app.set('port', process.env.PORT || 3000);

//static files
app.use(express.static(path.join(__dirname, 'dist/chatWithSockets')));

//start the server
const server = app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
    
});

//websockets
const io = socketIO(server); //necesita server inicializado

io.on('connection', (socket) => {
    console.log('new connection', socket.id);

    socket.on('join', (data) => {
        socket.join(data.room);
        socket.broadcast.to(data.room).emit('join', data);
    });

    socket.on('leave', (data) => {
        console.log('leave: ', data);
        
        socket.broadcast.to(data.room).emit('leave', data);
        socket.leave(data.room);
    });

    socket.on('message', (data) => {
	    console.log(data);
        //socket.broadcast.to(data.room).emit('message', data);
        io.sockets.to(data.room).emit('message', data);
    });
    
    socket.on('typing', (data) => {
        socket.broadcast.to(data.room).emit('typing', data);
    });
});
