const { Router } = require('express');
const {v4} = require('uuid');
const { news, users, subscribtions, favouritesNews } = require('../models/index');
const route = Router();

route.post('/add', async (req, res) => {
    try {
        const { body, tags, userId } = req.body;
        const tagsString = tags ? (tags.split(' ')).join(',') : null;
        const user = await users.findOne({where: {id: userId}});
        console.log(userId)
        const newNews = await news.create({
            id: v4(),
            userId,
            body,
            tags: tagsString,
            date: Date.now()
        });
        const response = {
            ...newNews.dataValues,
            tags: newNews.tags ? newNews.tags.split(',') : null,
            name: user.name,
            surname: user.surname,
            date: newNews.dataValues.date,
            isAdded: false
        }
        res.status(200).json(response);
    } catch (e) {
        console.log(e)
        res.status(500).json('Ошибка сервера');
    }
});

route.post('/delete', async (req, res) => {
    try {
        const { id } = req.body;
        await news.destroy({where: {id}});
        await favouritesNews.destroy({where: {newsId: id}})
        res.status(200).json(id);
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
            const findedFavourites = await favouritesNews.findOne({where: {userId, newsId: dataValues.id}});
            const tags = dataValues.tags ? dataValues.tags.split(',') : null;
            return {
                id: dataValues.id,
                userId: dataValues.userId,
                name: user.name,
                surname: user.surname,
                body: dataValues.body,
                tags,
                date: dataValues.date,
                favouritesId: findedFavourites ? findedFavourites.dataValues.id : null
            }
        });
        Promise.all(result)
        .then(news => {
            if(news.length > 0){
                res.status(200).json(news);
            } else {
                res.status(404).json('Новостей нет');
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
                const findedFavourites = await favouritesNews.findOne({where: {userId, newsId: dataValues.id}});
                const tags = dataValues.tags ? dataValues.tags.split(',') : null;
                return {
                    id: dataValues.id,
                    userId: dataValues.userId,
                    name: user.name,
                    surname: user.surname,
                    body: dataValues.body,
                    tags,
                    date: dataValues.date,
                    favouritesId: findedFavourites ? findedFavourites.dataValues.id : null
                }
            });
            Promise.all(result)
            .then(news => {
                if(news.length > 0){
                    res.status(200).json(news);
                } else {
                    res.status(404).json('Новостей нет');
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
        const {userId} = req.body;
        const findedFavouritesNews = await favouritesNews.findAll({where: {userId}});
        const findedNews = findedFavouritesNews.map( async ({newsId}) => {
            const findedNew = await news.findOne({where: {id: newsId}});
            const user = await users.findOne({where: {id: findedNew.dataValues.userId}});
            const findedFavourites = await favouritesNews.findOne({where: {userId, newsId: findedNew.dataValues.id}});
            const result = {
                id: findedNew.dataValues.id,
                userId: findedNew.dataValues.userId,
                name: user.name,
                surname: user.surname,
                body: findedNew.dataValues.body,
                tags: findedNew.dataValues.tags ? findedNew.dataValues.tags.split(',') : null,
                date: findedNew.dataValues.date,
                favouritesId: findedFavourites ? findedFavourites.dataValues.id : null
            };
            return result;
        });
        Promise.all(findedNews)
        .then(news => {
            if(news.length > 0){
                res.status(200).json(news);
            } else {
                res.status(404).json('Новостей нет');
            }
        })
        .catch(err => res.status(500).json('Ошибка сервера'))
    } catch (e) {
        res.status(500).json('Ошибка сервера');
    }
});

route.post('/favourites/add', async (req, res) => {
    try {
        const {userId, newsId} = req.body;
        const newFavoriteNews = await favouritesNews.create({
            userId,
            newsId
        });
        res.status(200).json(newFavoriteNews.dataValues.id);
    } catch (e) {
        res.status(500).json(e);
    }
});

route.post('/favourites/delete', async (req, res) => {
    try {
        const {favouritesId} = req.body;
        await favouritesNews.destroy({where: {id: favouritesId}});
        res.status(200).json(favouritesId);
    } catch (e) {
        res.status(500).json(e);
    }
});

module.exports = route;
