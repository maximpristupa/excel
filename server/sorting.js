"use strict";

const fs = require('fs');
const calc = require('./evaluate');
let calculatedСells = [];

function csvToObjects(csv) {
    let objects = [];
    calculatedСells = [];
    let objectType = typeof csv;
    let lines;
    if (objectType == 'string') {
        lines = csv.split("\n");
    } else {
        lines = csv;
    }
    lines.forEach((line, lineIndex) => {
        let cells = line.split(",");
        cells.forEach((cell, cellIndex) => {
            if (!cell) {
                return;
            }
            let links = cell.match(/[A-Z]\d/g);
            if (cell != `${+cell}` && cell[0] != '=') {
                links = null;
                cell = `~${cell}`
            }
            let chr = String.fromCharCode(65 + cellIndex);
            let obj = {
                name: `${chr}${lineIndex+1}`,
                value: cell.replace('=', ''),
                links: links
            };
            if (!links) {
                calculatedСells.push(obj);
            }
            objects.push(obj);
        })
    });

    while (calculatedСells.length < objects.length) {
        let readyForCalc = unsettledCells(objects).filter(i => i.links.filter(x => !arrayOfNames(calculatedСells).includes(x)).length == 0);
        if (readyForCalc.length == 0) {
            removeLinks(unsettledCells(objects), "Error")
        }
        readyForCalc.forEach((calcCell) => {
            calculatedСells.push(calcCell);
        });
        readyForCalc.forEach((cell) => {
            function replacer(match) {
                let found = calculatedСells.find(function(element) {
                    return element.name == match;
                });
                let value = '(' + found.value + ')';
                return value;
            }
            cell.value = cell.value.replace(/[A-Z]\d/g, replacer);
            cell.links = null;
        });
    }

    calculatedСells.forEach((cell) => {
        if (cell.value.match(/error/i) || cell.value === `${+cell.value}` || cell.value[0] == '~') {
            return;
        }
        cell.value = calc.evaluate(cell.value);
    })
    return objects;
}

function unsettledCells(objects) {
    return objects.filter(obj => obj.links);
}

function arrayOfNames(objects) {
    return objects.map(function(num) {
        return num.name;
    });
}

function removeLinks(objects, message = 'Error') {
    objects.forEach((cell) => {
        cell.links = null;
        cell.value = message;
        calculatedСells.push(cell);
    })
}

module.exports.csvToObjects = csvToObjects;