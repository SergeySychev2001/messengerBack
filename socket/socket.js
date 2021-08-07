const { messages, users } = require('../models');

const socketIO = (server) => {
    const io = require('socket.io')(server, {
        cors: {
            origin: "*"
        }
    });
    
    var sockets = [];   
    
    io.on('connection', socket => {
        const  newSocket = {
            socketId: socket.id,
            userId: socket.handshake.headers.userid
        }
        sockets.push(newSocket);
        console.log(`user with id: ${newSocket.userId} is connected`);
        socket.on('sendMessageFromClient', async ({ id, firstUserId, secondUserId, value, date }) => {
            try {
                const user = await users.findOne({where: {id: firstUserId}});
                const {socketId} = sockets.find((item) => item.userId === secondUserId);
                io.to(socketId).emit('sendMessageToClient', {
                    data: {
                        user: {
                            id: user.dataValues.id,
                            name: user.dataValues.name,
                            surname: user.dataValues.surname,
                            avatar: user.dataValues.avatar,
                        },
                        message: {
                            id: id,
                            userId: user.dataValues.id,
                            value: value,
                            date: date,
                            isMy: false
                        }
                    }
                });
            } catch (e) {
                console.log(e)
            }
        });
        socket.on('disconnect', () => {
            const neededSocket = sockets.find((item) => item.socketId === socket.id);
            console.log(`user with id: ${neededSocket.userId} is disconnected`);
            sockets = sockets.filter((item) => item.socketId !== neededSocket.socketId);
        });
    });    
}
module.exports = socketIO;