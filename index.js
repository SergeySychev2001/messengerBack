const path = require('path');
const http = require('http');
const express = require('express');
const sequelize = require('./utils/DB');
const cors = require('cors'); 
const { users, subscribtions, news, messages } = require('./routes/index');
const app = express();
const server = http.createServer(app);
const socketIO = require('./socket/socket');

const PORT = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use('/api/users', users);
app.use('/api/subscribtions', subscribtions);
app.use('/api/news', news);
app.use('/api/messages', messages);

socketIO(server);

const start = async() => {
    try {
        // await sequelize.sync({force: true});
        await sequelize.sync();
        server.listen(PORT, () => {
            console.log('Сервер запущен');
        });
    } catch (e) {
        console.log(e);
    }
}

start();

module.exports = {
    server
};