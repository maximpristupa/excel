upload('newfile');

function upload(file) {
  if (file === 'newfile') {
   let array = [['','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','','']];
   let json = JSON.stringify(array);
   printHtml(displayPage(json));
   return;
  }
  let formData = new FormData(document.forms.uploadFile);
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/uploadfile");
  xhr.send(formData);

  xhr.onload = () => printHtml(displayPage(xhr.response));
}

function displayPage(response = null) {
  if (!response) {return;}
  let csv = JSON.parse(response)
  let csvLength = csv[0].length;
  let charCodeAt = 'A'.charCodeAt(0);
  let rowNumber = 1;
  let html = ''

  let rowLetter = '';
  rowLetter += '<div class="letterRow">';
  for (let i = 0; i < csvLength; i++) {
    rowLetter += `<div class="letterCell"><div id="${i}_letter" class="letter">${String.fromCharCode(charCodeAt)}</div></div>`;
    charCodeAt += 1;
  }
  rowLetter += '</div>';
  html += rowLetter;

  html += '<form name="extable" class="extable">';
  csv.forEach((row, rowIndex) => {
      html += '<div class="row">';
      html += `<div class="numberRow" id="${rowIndex}_number"><div class="number">${rowNumber}</div></div>`;
      rowNumber += 1;
      row.forEach((cell, cellIndex) => {
          html += `<div class="cell"> <input id="${rowIndex}_${cellIndex}" onmouseover="backlight('${rowIndex}_${cellIndex}')" onmouseout="removeBacklight('${rowIndex}_${cellIndex}')" class="cellInput cell" onclick="openInput(this)" onkeydown = "if (event.keyCode == 13) calculate()" type="text" name="cell" value="${cell}"> </div>`;
      });
      html += '</div>';
  });
  html += `<input type="hidden" name="rowCount" value="${csv.length}">`;
  html += '</form>';
  return html;
}

function printHtml(html) {
  document.getElementById('table').innerHTML = html;
}

function calculate(arg) {
  let formData = new FormData(document.forms.extable);
  if (arg === 'download') {
    formData.append("download", "true");
  }
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/calculate");
  xhr.send(formData);

  xhr.onload = () => printHtml(displayPage(xhr.response));
}

// input row
let input = document.getElementsByClassName('cellInputForm')[0];
function openInput(cell) {
  input.value = cell.value;
  input.setAttribute('cellId', cell.id);
  changeInput(cell);
  changeCell(cell);
}


function changeInput(cell) {
  cell.oninput = function() {
    input.value = cell.value;
    input.setAttribute('cellId', cell.id);
    highlightTheMentionedCell(cell.value);
  };
}

// function inputHighlightTheMentionedCell() {
//   input.oninput = function() {
//     highlightTheMentionedCell(input.value);
//   }
// }

function highlightTheMentionedCell(value) {
    let cells = document.getElementsByClassName('cell');
    for (let i = 0; i < cells.length; i++) {
          cells[i].classList.remove("highlightRed");
        }
    let links = value.match(/[A-Z]\d+/g);
    if (!links) {return;}
    for (let i = 0; i < links.length; i++) {
      const letter = links[i].match(/[A-Z]/)[0];
      const number = links[i].match(/(\d+)/)[0];
      let id = `${number - 1}_${letter.charCodeAt(0) - 65}`;
      let linkCell = document.getElementById(id);
      linkCell.classList.add("highlightRed");
    }
}

function changeCell(cell) {
  input.oninput = function() {
    cell.value = input.value;
    highlightTheMentionedCell(input.value);
  };
}

function writeCell() {
  let cellId = input.getAttribute('cellId');
  let cell = document.getElementById(cellId);
  cell.value = input.value;
  calculate();
  setTimeout(writeInput, 1000);
}

function writeInput(argument) {
  let cellId = input.getAttribute('cellId');
  let cell = document.getElementById(cellId);
  input.value = cell.value;
}

function backlight(id) {
  let numberId = id.match(/(\d+)_/)[1];
  let letterId = id.match(/_(\d+)/)[1];
  let numberCell = document.getElementById(numberId + '_number');
  let letterCell = document.getElementById(letterId + '_letter');
  numberCell.style.backgroundColor = "#cacaca";
  letterCell.style.backgroundColor = "#cacaca";
}

function removeBacklight(id) {
  let numberId = id.match(/(\d+)_/)[1];
  let letterId = id.match(/_(\d+)/)[1];
  let numberCell = document.getElementById(numberId + '_number');
  let letterCell = document.getElementById(letterId + '_letter');
  numberCell.style.backgroundColor = "#f3f3f5";
  letterCell.style.backgroundColor = "#f3f3f5"; 
}
