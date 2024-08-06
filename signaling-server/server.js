const io = require('socket.io')(3000); // Create a new instance of Socket.IO on port 3000

io.on('connection', socket => {
    console.log('New user connected');

    // Handle offer
    socket.on('offer', (offer) => {
        socket.broadcast.emit('offer', offer); // Broadcast offer to all other connected clients
    });

    // Handle answer
    socket.on('answer', (answer) => {
        socket.broadcast.emit('answer', answer); // Broadcast answer to all other connected clients
    });

    // Handle ICE candidates
    socket.on('ice-candidate', (candidate) => {
        socket.broadcast.emit('ice-candidate', candidate); // Broadcast ICE candidate to all other connected clients
    });

    // Handle chat messages
    socket.on('chat-message', (message) => {
        socket.broadcast.emit('chat-message', message); // Broadcast chat message to all other connected clients
    });
});
