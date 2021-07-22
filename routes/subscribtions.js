const {Router} = require('express');
const {subscribtions, users} = require('../models/index');
const route = Router();

route.post('/add', async (req, res) => {
    try {
        const {firstUserId, secondUserId} = req.body;
        const newSubscribtion = await subscribtions.create({
            firstUserId,
            secondUserId
        });
        res.status(200).json(newSubscribtion);
    } catch (e) {
        res.status(500).json('Ошибка Сервера');
    }
});

route.post('/delete', async (req, res) => {
    try {
        const {firstUserId, secondUserId} = req.body;
        const dest = await subscribtions.destroy({where: {
            firstUserId, 
            secondUserId
        }});
        if (dest){
            res.status(200).json(secondUserId);
        } else {
            res.status(404).json('Подписка не найдена');
        }
    } catch (e) {
        res.status(500).json('Ошибка Сервера');
    }
});

route.post('/find', async (req, res) => {
    try {
        const {firstUserId, secondUserId} = req.body;
        const findedSub = await subscribtions.findOne({where: {
            firstUserId: firstUserId,
            secondUserId: secondUserId
        }});
        if (findedSub) {
            res.status(200).json('Найдено');
        } else {
            res.status(200).json('Не найдено');
        }
    } catch (e) {
        res.status(500).json('Ошибка сервера');
    }
});

route.post('/findall', async (req, res) => {
    try {
        const {firstUserId} = req.body;
        const findedSub = await subscribtions.findAll({where: {firstUserId}});
        const findedUsers = await findedSub.map( async ({dataValues}) => {
            const findedUser = await users.findOne({where: {id: dataValues.secondUserId}});
            return findedUser;
        });
        Promise.all(findedUsers).then(users => {
            if (users.length > 0) {
                const result = users.map((item) => {
                    const date = new Date(item.year);
                        return {
                            id: item.id,
                            name: item.name,
                            surname: item.surname,
                            avatar: item.avatar,
                            year: date.getFullYear(),
                            month: date.getMonth(),
                            day: date.getDate(),
                            city: item.city
                        }
                    });
                res.status(200).json(result);
            } else {
                res.status(404).json('Не найдено');
            }
        })
        .catch(err => res.status(500).json('Ошибка сервера'));      
    } catch (e) {
        res.status(500).json('Ошибка сервера')
    }
});

module.exports = route;