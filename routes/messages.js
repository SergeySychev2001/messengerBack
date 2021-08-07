const { Router } = require('express');
const { messages, users } = require('../models');
const route = Router();

route.post('/add', async (req, res) => {
    try {
        const { message, firstUserId, secondUserId } = req.body;
        const newMessage = await messages.create({
            value: message,
            firstUserId: firstUserId,
            secondUserId: secondUserId,
            date: Date.now()
        });
        res.status(200).json(newMessage);
    } catch (e) {
        res.status(500).json();
    }
});

route.post('/messages', async (req, res) => {
    try {
        const {userId} = req.body;
        const messagesFirstPart = await messages.findAll({where: {firstUserId: userId}});
        const messagesSecondPart = await messages.findAll({where: {secondUserId: userId}});
        const FormatedMessagesFirstPart = messagesFirstPart.map(({dataValues}) => {
            return {
                id: dataValues.id,
                userId: dataValues.secondUserId,
                value: dataValues.value,
                date: dataValues.date,
                isMy: true
            };
        });
        const FormatedMessagesSecondPart = messagesSecondPart.map(({dataValues}) => {
            return {
                id: dataValues.id,
                userId: dataValues.firstUserId,
                value: dataValues.value,
                date: dataValues.date,
                isMy: false
            };
        });
        const messageAll = [...FormatedMessagesFirstPart, ...FormatedMessagesSecondPart];
        const formatedMessageAll = [... new Set(messageAll.map(({userId}) => userId))].map( async (item) => {
            const {dataValues} = await users.findOne({where: {id: item}});
            const messages = messageAll.filter(({userId}) => userId === item);
            return {
                user: {
                    id: dataValues.id,
                    name: dataValues.name,
                    surname: dataValues.surname,
                    avatar: dataValues.avatar,
                },
                messages
            }
        });
        if(formatedMessageAll.length > 0){
            Promise.all(formatedMessageAll)
            .then(result => {
                res.status(200).json(result);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json('Ошибка сервера');
            });
        } else {
            res.status(200).json('Сообщений нет')
        }
    } catch (e) {
        console.error(e);
        res.status(500).json('Ошибка сервера');
    }
});

module.exports = route;