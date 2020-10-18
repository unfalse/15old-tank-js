#!/usr/bin/env nodejs
const cors = require('cors');

const express = require("express");
const fs = require('fs');
const filename = 'levels.json';

const app = express();
app.use(express.json());
app.use(cors());
app.options('*', cors());

const getFileContents = () => JSON.parse(fs.readFileSync(process.cwd() + "/server/" + filename).toString());

app.get("/list", function(request, response) {
    const contents = getFileContents();
    const names = contents.levels.map(level => ({ id: level.id, name: level.name }));
    response.send(names);
});

app.get("/new", function(request, response) {
    const newLevelData = request.body;
    const contents = getFileContents();
    const lastId = contents.levels.slice(-1)[0];
    const newId = lastId === undefined ? 0 : +lastId + 1;
    const levelData = {
        id: newId,
        name: 'level' + newId,
        data: newLevelData
    };

    const newContents = { levels: levels.concat([levelData]) };
    fs.writeFileSync(process.cwd() + "/server/" + "levelsTest.json", JSON.stringify(newContents));
});

app.get("/level", function(request, response) {
    const contents = getFileContents();
    const id = request.query.id;
    const level = contents.levels.find(level => level.id === id);
    response.send(level);
});

app.post("/save", function(request, response) {
    const newLevel = request.body;
    const contents = getFileContents();
    const newLevels = contents.levels.map(level => {
        if (level.id === newLevel.id) {
            level.data = newLevel.data;
        }
        return level;
    });
    const newContents = { levels: newLevels };
    fs.writeFileSync(process.cwd() + "/server/" + filename, JSON.stringify(newContents));
    response.sendStatus(200);    
});

app.listen(8080);
