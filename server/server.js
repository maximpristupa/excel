"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');

const calc = require('./evaluate');
const sort = require('./sorting');
const rw = require('./rw');

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(express.static('views'));

app.get('/', function(req, res) {
});

let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
})

let upload = multer({
    storage: storage
})

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file;
    let objects = sort.csvToObjects(rw.readCsv(file.path));
    let csv = rw.objectsToCsv(objects);
    res.send(csv);
})

app.post('/calculate', upload.single('extable'), (req, res, next) => {
    let csv = req.body.cell;
    let rowCount = req.body.rowCount;
    let size = csv.length / +rowCount;
    let subarray = [];
    for (let i = 0; i < Math.ceil(csv.length / size); i++) {
        subarray[i] = csv.slice((i * size), (i * size) + size).join();
    }
    let objects = sort.csvToObjects(subarray);
    let calculatedCsv = rw.objectsToCsv(objects);
    if (req.body.download) {
        fs.writeFile('newfile.csv', calculatedCsv, function (err) {
          if (err) throw err;
          console.log('File is created successfully.');
        }); 
    }
    // if (req.body.download) {rw.writeCsv(calculatedCsv, 'uploads/')}

    res.send(calculatedCsv);
})

app.listen(3000, () => console.log('Server started on port 3000'));
