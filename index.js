// Data

const fs = require('fs');
const calc = require('./evaluate')

const row_data = [
  {
    name: 'Ivan',
    surname: 'Ivanov',
    age: 20,
    gender: 'M'
  }, {
    name: 'Fedor',
    surname: 'Fedorov',
    age: 25,
    gender: 'M',
  }, {
    name: 'Maria',
    surname: 'Brown',
    age: 78,
    gender: 'F'
  }, {
    name: 'Maria',
    surname: 'Brown',
    age: 78,
    gender: 'F'
  }
];

// Write

function write_csv(data, file = 'data.csv') {
	const fastcsv = require('fast-csv');
	// const fs = require('fs');
	const ws = fs.createWriteStream(file);
	fastcsv
	  .write(data, { headers: true })
	  .pipe(ws);
	console.log('The CSV file was written successfully');
}

// Read

function read_csv(file) {
	const csv = require('csv-parser');
	// const fs = require('fs');
	fs.createReadStream(file)
	  .pipe(csv())
	  .on('data', (row) => {
	    console.log(row);
	  })
	  .on('end', () => {
	    console.log('CSV file successfully processed');
	  });
}

// write_csv(row_data)
// read_csv("data.csv")

// Cell calculation

console.log(calc.evaluate('(1+2+5)^3'))
console.log(calc.evaluate('1+2+5-10'))
console.log(calc.evaluate('1+2+5-10+40*2'))
console.log(calc.evaluate('(1+2+5-10+40*2)/4'))
console.log(calc.evaluate('(3*4-3)^2'))
console.log(calc.evaluate('1+2*3-(3+8)^3+3/9'))