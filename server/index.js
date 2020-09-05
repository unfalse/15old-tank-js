#!/usr/bin/env nodejs
const cors = require('cors');

// подключение express
const express = require("express");
const fs = require('fs');
const filename = 'levels.json';

// создаем объект приложения
const app = express();
app.use(cors());
app.options('*', cors());

// определяем обработчик для маршрута "/"
// app.get("/", function(request, response){
//      
//     // отправляем ответ
//     response.send("<h2>Привет Express!</h2>");
// });

const getFileContents = () => JSON.parse(fs.readFileSync(process.cwd() + "/server/" + filename).toString());

app.get("/list", function(request, response) {
    const contents = getFileContents();
    const names = contents.levels.map(level => ({ id: level.id, name: level.name }));
    response.send(names);
});

app.get("/level", function(request, response) {
    const contents = getFileContents();
    const id = request.query.id;
    const level = contents.levels.find(level => level.id === id);
    response.send(level);
});

// начинаем прослушивать подключения на 3000 порту
app.listen(8080);
