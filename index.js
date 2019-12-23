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

    socket.on('message', (data) => {
	console.log(data);
        io.sockets.emit('message', data);
    });
    
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
        console.log(data);
        
        
    });
});
