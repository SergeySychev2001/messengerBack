const path = require('path');
const express = require('express');
const sequelize = require('./utils/DB');
const cors = require('cors'); 
const { users, subscribtions, news } = require('./routes/index');
const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.use('/api/users', users);
app.use('/api/subscribtions', subscribtions);
app.use('/api/news', news);

const start = async() => {
    try {
        // await sequelize.sync({force: true});
        await sequelize.sync();
        app.listen(PORT, () => {
            console.log('Сервер запущен');
        });
    } catch (e) {
        console.log(e);
    }
}

start();