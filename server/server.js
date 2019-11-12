const express = require('express')
const bodyParser= require('body-parser')
const multer = require('multer');

const calc = require('../evaluate')
const sort = require('../sorting')
const rw = require('../rw')
 
const app = express();
app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({extended: true}))
 
app.get('/',function(req,res){
  res.render("calc");
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
 
var upload = multer({ storage: storage })

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  let objects = sort.csvToObjects(rw.readCsv(file.path))
  let csv = rw.objectsToCsv(objects) 
  rw.writeCsv(csv, file.path)
  res.render("calc", {csv: csv, row_count: csv.length});
  
})

app.post('/calculate', (req, res, next) => {
  let csv = req.body.cell
  let row_count = req.body.row_count
  let size = csv.length / +row_count;
  let subarray = [];
  for (let i = 0; i <Math.ceil(csv.length/size); i++){
    subarray[i] = csv.slice((i*size), (i*size) + size).join();
  }

  let objects = sort.csvToObjects(subarray)
  let calculated_csv = rw.objectsToCsv(objects)
  res.render("calc", {csv: calculated_csv, row_count: calculated_csv.length});
})

app.listen(3000, () => console.log('Server started on port 3000'));
