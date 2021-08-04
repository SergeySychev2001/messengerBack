const { messages, users } = require('../models');

const socketIO = (server) => {
    const io = require('socket.io')(server, {
        cors: {
            origin: "*"
        }
    });
    
    var sockets = [];
    
    io.on('connection', socket => {
        const id = socket.id;
        socket.on('userIsConnected', (userId) => {
            sockets[id] = userId;
            console.log(`user with id: ${sockets[id]} is connected`);
        });
        socket.on('disconnect', () => {
            console.log(`user with id: ${sockets[id]} is disconnected`);
        });
    });    
}
module.exports = socketIO;