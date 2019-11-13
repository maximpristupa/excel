"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');

const calc = require('./evaluate');
const sort = require('./sorting');
const rw = require('./rw');

const app = express();
app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/', function(req, res) {
    res.send(displayPage());
    // res.render("calc");
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
    if (!file) {
        res.send(displayPage());
        // res.render("calc");
        return;
        // const error = new Error('Please upload a file')
        // error.httpStatusCode = 400
        // return next(error)
    }
    let objects = sort.csvToObjects(rw.readCsv(file.path));
    let csv = rw.objectsToCsv(objects);
    rw.writeCsv(csv, file.path);
    res.send(displayPage(csv));
    // res.render("calc", {csv: csv, rowCount: csv.length});

})

app.post('/calculate', (req, res, next) => {
    let csv = req.body.cell;
    let rowCount = req.body.rowCount;
    let size = csv.length / +rowCount;
    let subarray = [];
    for (let i = 0; i < Math.ceil(csv.length / size); i++) {
        subarray[i] = csv.slice((i * size), (i * size) + size).join();
    }
    let objects = sort.csvToObjects(subarray);
    let calculatedCsv = rw.objectsToCsv(objects);
    res.send(displayPage(calculatedCsv));
    // res.render("calc", {csv: calculatedCsv, rowCount: calculatedCsv.length});
})

app.listen(3000, () => console.log('Server started on port 3000'));


function displayPage(csv = null) {
    let html = '<form action="/uploadfile" enctype="multipart/form-data" method="POST""> <input type="file" name="myFile" /> <input type="submit" value="Upload a file"/> </form>';
    if (!csv) {
        return html;
    }

    html += '<form action="/calculate" method="POST">';
    csv.forEach((row) => {
        html += '<div class="row">';
        row.forEach((cell) => {
            html += `<div class="cell" style="display:inline-block; margin: 10px; text-align: center;"> <input type="text" name="cell" value="${cell}" style="width: 100px; height: 100px; font-size: 20px;"> </div>`;
        });
        html += '</div>';
    });
    html += `<input type="hidden" name="rowCount" value="${csv.length}">`;
    html += '<input type="submit" value="Recalculate"/>';
    html += '</form>';
    return html;
}