const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.get("/", (request, response) => {
    console.log("Route /");
    response.send("<h2>Hello Express!</h2>");
});

// app.get("/save", (request, response) => {
//     fs.appendFile("maps/first.mst", "first map", () => {});
//     response.send("saved!");
// });

app.get("/list", (request, response) => {
    const directoryPath = path.join(__dirname, "../maps");
    let filelist = [];
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            return console.log("Unable to scan directory: " + err);
        }
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            console.log(file);
            filelist.push(file);
        });
    });
console.log(filelist);
    response.send('<div>' + filelist.join('<br>') + '</div>');
});

app.listen(3210);
