"use strict";

// Data

const fs = require('fs');
const charCodeA = 'A'.charCodeAt(0);
// Write

function objectsToCsv(objects) {
    const letters = objects.map((num) => num.name.match(/[A-Z]/)[0]);
    const numbers = objects.map((num) => num.name.match(/(\d+)/)[0]);
    let lastLetter = letters.sort().pop();
    let lastNumber = numbers.sort((a, b) => {return a - b}).pop();
    const charCodeLastLetter = lastLetter.charCodeAt(0);
    let file = [];
    for (let i = 0; i < lastNumber; i++) {
        let row = [];
        for (let y = charCodeA; y < charCodeLastLetter + 1; y++) {
            let found = objects.find((element) => {
                return element.name == `${String.fromCharCode(y)}${i+1}`;
            });
            if (found) {
                row.push(`${found.value}`.replace('~', ''))
            } else {
                row.push('')
            }
        }
        while (row.length < 20) { row.push(''); }
        file.push(row);
    }
    while (file.length < 30) { file.push(Array(20).fill('')) }            
    return file;
}

function writeCsv(objects, file) {
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

module.exports.objectsToCsv = objectsToCsv;
module.exports.writeCsv = writeCsv;
module.exports.readCsv = readCsv;