"use strict";

// Data

const fs = require('fs');
const calc = require('./evaluate')
const sort = require('./sorting')

// Write

function objectsToCsv(objects) {
  let letters = objects.map(function(num) {
      return num.name.match(/[A-Z]/)[0];
  });
  let numbers = objects.map(function(num) {
      return num.name.match(/\d/)[0];
  });
  let lastLetter = letters.sort().pop()
  let lastNumber = numbers.sort().pop()
  let file = []
  for (var i = 0; i < lastNumber; i++) {
    let row = []
    for (var y = 'A'.charCodeAt(0); y < lastLetter.charCodeAt(0) + 1; y++) {
      let found = objects.find(function(element) { 
        return element.name == `${String.fromCharCode(y)}${i+1}`;
      });
      if (found) {row.push(found.value)} else {row.push('')}
    }
    file.push(row)
  }
  return file
}

function writeCsv(objects,file) {
  const createCsvWriter = require('csv-writer').createArrayCsvWriter;
  const csvWriter = createCsvWriter({
      path: file
  });
  csvWriter.writeRecords(objects); 
}

// Read

function readCsv(file) {
  return fs.readFileSync(file, 'utf8');
}

module.exports.objectsToCsv = objectsToCsv
module.exports.writeCsv = writeCsv
module.exports.readCsv = readCsv