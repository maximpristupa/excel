const fs = require('fs');
const calc = require('./evaluate')

function csvToObjects(csv) {
	objects = []
	calculatedСells = []
	let lines = csv.split("\n");
	lines.forEach(function(line, line_index) {
	let cells=line.split(",");
		cells.forEach(function(cell, cell_index) {
			if (!cell) {return;}
	  	let links = cell.match(/[A-Z]\d/g)
	  	let chr = String.fromCharCode(65 + cell_index);
	  	let obj = {
	  		name: `${chr}${line_index+1}`,
	  		value: cell.replace('=',''),
	  		links: links
	  	};
	  	if (!links) { calculatedСells.push(obj); }
	  	objects.push(obj)
		})
	});

	while(calculatedСells.length < objects.length){
		deleteEmptyCells(objects)
		deleteCycle(objects)
		let ready_for_calc = unsettledCells(objects).filter(i => i.links.filter(x => !arrayOfNames(calculatedСells).includes(x)).length == 0);
		ready_for_calc.forEach(function(calc_cell) {
			calculatedСells.push(calc_cell);
		});
		ready_for_calc.forEach(function(cell) {
			function replacer(match) {
				let found = calculatedСells.find(function(element) { 
	  			return element.name == match;
				});
				let value = '('+ found.value + ')'
				return value
			}
			cell.value = cell.value.replace(/[A-Z]\d/g, replacer);
			cell.links = null
		});
	}

	calculatedСells.forEach(function(cell) {
		if (cell.value.match(/error/i)) {return;}
		cell.value = calc.evaluate(cell.value)
	})

	return objects
}

function unsettledCells(objects) {
	return objects.filter(obj => obj.links)
}

function arrayOfNames(objects) {
	return  objects.map(function(num) {
	  return num.name;
	});
}

function deleteEmptyCells(objects) {
	let cells_with_empty_values = unsettledCells(objects).filter(i => i.links.filter(x => !arrayOfNames(objects).includes(x)).length > 0);
	removeLinks(cells_with_empty_values, "Error. Possibly reference to an empty cell.")
}

function removeLinks(objects, message) {
	objects.forEach(function(cell) {
		cell.links = null
		cell.value = message
		calculatedСells.push(cell)
	})
}

function deleteCycle(objects) {
	cycle = []
	objects.forEach(function(cell) {
		if (cell.links) {
			let links = objects.filter(i => cell.links.includes(i.name))
			links.forEach(function(link_cell) {
				let error
				if (link_cell.links) { error = link_cell.links.includes(cell.name) }
				if (error) {cycle.push(cell); cycle.push(link_cell);}
			});
		}
	})
	let uniqueItems = Array.from(new Set(cycle))
	removeLinks(uniqueItems, "Error. Cycle in cells.")
}

module.exports.csvToObjects = csvToObjects