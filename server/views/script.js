upload('newfile');

function upload(file) {
  if (file === 'newfile') {
    const emptyCsvArray = [
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']
    ];
    let json = JSON.stringify(emptyCsvArray);
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
  if (!response) {
    return;
  }
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

function calculate(filename) {
  let formData = new FormData(document.forms.extable);
  if (filename) {
    formData.append("filename", filename);
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

function highlightTheMentionedCell(value) {
  let cells = document.getElementsByClassName('cell');
  for (let i = 0; i < cells.length; i++) {
    cells[i].classList.remove("highlightRed");
  }
  let links = value.match(/[A-Z]\d+/g);
  if (!links) {
    return;
  }
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

function download(argument) {
  let modal = document.getElementsByClassName('filename')[0];
  modal.classList.add("showfilename");
  let container = document.getElementsByClassName('container')[0];
  container.classList.add("cover");
}

function showModal(argument) {
  let modal = document.getElementsByClassName('modal')[0];
  modal.classList.add("showmodal");
  let container = document.getElementsByClassName('container')[0];
  container.classList.add("cover");
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/lastfiles");
  xhr.send();
  xhr.onload = () => printFiles(xhr.response);
}

function writeFile(argument) {
  let fileName = document.getElementsByClassName('inputfilename')[0].value
  calculate(fileName)
  let modal = document.getElementsByClassName('filename')[0];
  modal.classList.remove("showfilename");
}

function printFiles(json) {
  let modal = document.getElementsByClassName('modal')[0];
  html = '';
  html += '<p>Choose File</p>';
  let records = JSON.parse(json);
  for (let k in records) {
    html += `<div class="modalfilename" onclick="uploadLatestFile('${k}')">${records[k]}</div>`
  }
  modal.innerHTML = html;
}

function uploadLatestFile(filename) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/openfile" + `?filename=${filename}`);
  xhr.send(filename);
  xhr.onload = () => printHtml(displayPage(xhr.response));
  let modal = document.getElementsByClassName('modal')[0];
  modal.classList.remove("showmodal");
  let container = document.getElementsByClassName('container')[0];
  container.classList.remove("cover");
}

function closeCover(argument) {
  let container = document.getElementsByClassName('container')[0];
  container.classList.remove("cover");
  let modal = document.getElementsByClassName('modal')[0];
  modal.classList.remove("showmodal");  
  let input = document.getElementsByClassName('filename')[0];
  input.classList.remove("showfilename");
}