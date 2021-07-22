const { Router } = require('express');
const {v4} = require('uuid');
const { news, users, subscribtions } = require('../models/index');
const route = Router();

route.post('/add', async (req, res) => {
    try {
        const { body, tags, userId } = req.body;
        const tagsString = tags ? (tags.split(' ')).join(',') : null;
        const newNew = await news.create({
            id: v4(),
            userId,
            body,
            tags: tagsString,
            date: Date.now()
        });
        res.status(200).json(newNew);
    } catch (e) {
        res.status(500).json('Ошибка сервера');
    }
});

route.post('/find/my', async (req, res) => {
    try {
        const {userId} = req.body;
        const findedNews = await news.findAll({where: {userId}});
        const result = await findedNews.map( async ({dataValues}) => {
            const user = await users.findOne({where: {id: userId}});
            const tags = dataValues.tags ? dataValues.tags.split(',') : null;
            const date = new Date(dataValues.date);
            return {
                id: dataValues.id,
                userId: dataValues.userId,
                name: user.name,
                surname: user.surname,
                body: dataValues.body,
                tags,
                date: `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`,
            }
        });
        Promise.all(result)
        .then(news => {
            if(news.length > 0){
                res.status(200).json(news);
            } else {
                res.status(404).json('Не найдено');
            }
        })
        .catch(err => console.log('Ошибка сервера'));
    } catch (e) {
        res.status(500).json('Ошибка сервера');
    }
});

route.post('/find/subscribtions', async (req, res) => {
    try {
        const {userId} = req.body;
        const userSubscribtions = await subscribtions.findAll({where: {firstUserId: userId}});
        const findedNews = userSubscribtions.map( async ({secondUserId}) => {
            return await news.findAll({where: {userId: secondUserId}});
        });
        Promise.all(findedNews)
        .then( async (data) => {
            const flatedFindedNews = data.flat();
            const result = flatedFindedNews.map( async ({dataValues}) => {
                const user = await users.findOne({where: {id: dataValues.userId}});
                const tags = dataValues.tags ? dataValues.tags.split(',') : null;
                const date = new Date(dataValues.date);
                return {
                    id: dataValues.id,
                    userId: dataValues.userId,
                    name: user.name,
                    surname: user.surname,
                    body: dataValues.body,
                    tags,
                    date: `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`,
                }
            });
            Promise.all(result)
            .then(news => {
                if(news.length > 0){
                    res.status(200).json(news);
                } else {
                    res.status(404).json('Не найдено');
                }
            })
            .catch(err => console.log('Ошибка сервера'));
        })
    } catch (e) {
        res.status(500).json('Ошибка сервера');
    }
});

route.post('/find/favourites', async (req, res) => {
    try {
        
    } catch (e) {
        res.status(500).json('Ошибка сервера');
    }
});

module.exports = route;
