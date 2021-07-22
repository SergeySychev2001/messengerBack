const {Router} = require('express');
const fs = require('fs');
const path = require('path');
const { v4 } = require('uuid');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const {users} = require('../models/index');
const route = Router(); 

function copyFile(source, target) {
    return new Promise(function(resolve, reject) {
        var rd = fs.createReadStream(source);
        rd.on('error', rejectCleanup);
        var wr = fs.createWriteStream(target);
        wr.on('error', rejectCleanup);
        function rejectCleanup(err) {
            rd.destroy();
            wr.end();
            reject(err);
        }
        wr.on('finish', resolve);
        rd.pipe(wr);
    });
}

const getUsersMediaDir = (id) => {
    const dir = path.join(__dirname, '../', 'media', 'users', id);
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
        getUsersMediaDir(id);
    }
    return dir;
}

route.get("/user/avatar/:id", async (req, res) => {
    const id = req.params.id;
    const user = await users.findOne({where: {id: id.toString()}});
    res.sendFile(`${getUsersMediaDir(id)}/avatar.jpg`);
});

route.get("/user/data/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await users.findOne({where: {id: id.toString()}});
        
        res.status(200).json({
            id: user.id,
            name: user.name,
            surname: user.surname,
            avatar: user.avatar,
            year: user.year,
            city: user.city
        });
    } catch (e) {
        res.status(404).json('Не найдено');
    }
});

route.get("/user/data/", async (req, res) => {
    try {
        const id = req.params.id;
        const findedUsers = await users.findAll();
        const result = findedUsers.map((item) => {
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
    } catch (e) {
        res.status(404).json('Не найдено');
    }
});

route.post("/user/edit/data/:id", async(req, res) => {
    const id = req.params.id;
    const { name, surname, day, month, year, city } = req.body;
    try {
        await users.update({ name, surname, year: new Date(`${+year}-${+month + 1}-${+day}`), city}, {where: {id}});
        res.status(200).json('Данные успешно обновлены');
    } catch (e) {
        res.status(500).json('Ошибка сервера');
    }
});

route.post("/user/edit/avatar/:id", upload.single('avatar'), (req, res) => {
    const {id} = req.params;
    const filePath = `${getUsersMediaDir(id)}/avatar.jpg`;
    copyFile(req.file.path, filePath)
    .then( async (res) => {
        try {
            await users.update({avatar: true}, {where: {id}});
            res.status(200).json('Данные успешно обновлены');
        } catch (e) {
            res.status(500).json('Ошибка сервера');
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json('Ошибка сервера')
    });
});

route.post("/login", async (req, res) => {
    try {
        const {login, password} = req.body;
        const user = await users.findOne({where: {login: login.toString()}});
        if(user){
            if(password.toString() === user.dataValues.password){
                res.status(200).json({
                    userId: user.dataValues.id,
                    token: v4()
                });
            } else {
                res.status(404).json('Неверный логин или пароль');
            }
        } else {
            res.status(404).json('Неверный логин или пароль');
        }
    } catch (e) {
        res.status(500).json('Ошибка сервера');
    }
});

route.post("/signup", async (req, res) => {  
    try {
        const {name, surname, year, month, day, email, login, password} = req.body;
        const id = v4();
        const newUser = await users.create({
            id,
            name: name.toString(),
            surname: surname.toString(),
            avatar: false,
            year: new Date(`${+year}-${+month}-${+day + 1}`),
            email: email.toString(),
            login: login.toString(),
            password: password.toString()
        });
        getUsersMediaDir(id);
        res.json(newUser);  
    } catch (e) {
        console.log(e);
        res.status(500).json('Произошла ошибка сервера');
    }
});

module.exports = route;