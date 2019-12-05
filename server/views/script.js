upload('newfile');

function upload(file) {
  const rowCount = 30;
  const rowLength = 17;
  if (file === 'newfile') {
    const emptyCsvArray = Array(rowCount).fill().map(() => Array(rowLength).fill().map(() => ''));
    let json = JSON.stringify(emptyCsvArray);
    printHtml(displayPage(json));
    return;
  }
  let formData = new FormData(document.forms.uploadFile);
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/uploadfile');
  xhr.send(formData);
  xhr.onload = () => printHtml(displayPage(xhr.response));
}

function displayPage(response = null) {
  if (!response) {
    return;
  }
  const csv = JSON.parse(response)
  const csvLength = csv[0].length;
  let charCodeAt = 'A'.charCodeAt(0);
  let rowNumber = 1;
  let html = ''

  let rowLetter = '';
  rowLetter += '<div class="letter-row">';
  for (let i = 0; i < csvLength; i++) {
    rowLetter += `<div class="letter-cell"><div id="${i}_letter" class="letter">${String.fromCharCode(charCodeAt)}</div></div>`;
    charCodeAt += 1;
  }
  rowLetter += '</div>';
  html += rowLetter;

  html += '<form name="extable" class="extable">';
  csv.forEach((row, rowIndex) => {
    html += '<div class="row">';
    html += `<div class="number-row" id="${rowIndex}_number"><div class="number">${rowNumber}</div></div>`;
    rowNumber += 1;
    row.forEach((cell, cellIndex) => {
      html += `<div class="cell"> <input id="${rowIndex}_${cellIndex}" onmouseover="backlight('${rowIndex}_${cellIndex}', '#cacaca')" onmouseout="backlight('${rowIndex}_${cellIndex}', '#f3f3f5')" class="cell-input cell" onclick="openInput(this)" onkeydown = "if (event.keyCode == 13) calculate()" type="text" name="cell" value="${cell}"> </div>`;
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

function calculate(filename, callback) {
  let formData = new FormData(document.forms.extable);
  if (filename) {
    formData.append('filename', filename);
  }
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/calculate');
  xhr.send(formData);

  xhr.onload = () => {
    printHtml(displayPage(xhr.response));
    if (callback) {
      callback();
    }
  }
}

let input = document.getElementsByClassName('cell-input-form')[0];

function openInput(cell) {
  input.value = cell.value;
  input.setAttribute('cell-id', cell.id);
  changeInput(cell);
  changeCell(cell);
}

function changeInput(cell) {
  cell.oninput = function() {
    input.value = cell.value;
    input.setAttribute('cell-id', cell.id);
    highlightTheMentionedCell(cell.value);
  };
}

function highlightTheMentionedCell(value) {
  let cells = document.getElementsByClassName('cell');
  for (let i = 0; i < cells.length; i++) {
    cells[i].classList.remove('highlight-red');
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
    linkCell.classList.add('highlight-red');
  }
}

function changeCell(cell) {
  input.oninput = () => {
    cell.value = input.value;
    highlightTheMentionedCell(input.value);
  };
}

function writeCell(event) {
  if (event !== 13) {
    return;
  }
  const cellId = input.getAttribute('cell-id');
  let cell = document.getElementById(cellId);
  cell.value = input.value;
  calculate(null, writeInput);
}

function writeInput(argument) {
  const cellId = input.getAttribute('cell-id');
  let cell = document.getElementById(cellId);
  input.value = cell.value;
}

function backlight(id, color) {
  const numberId = id.match(/(\d+)_/)[1];
  const letterId = id.match(/_(\d+)/)[1];
  let numberCell = document.getElementById(`${numberId}_number`);
  let letterCell = document.getElementById(`${letterId}_letter`);
  numberCell.style.backgroundColor = color;
  letterCell.style.backgroundColor = color;
}

function addClass(element, newClass) {
  let modal = document.getElementsByClassName(element)[0];
  modal.classList.add(newClass);
}

function removeClass(element, newClass) {
  let modal = document.getElementsByClassName(element)[0];
  modal.classList.remove(newClass);
}

function download(argument) {
  let input = document.getElementsByClassName('inputfilename')[0];
  input.value = '';
  addClass('filename', 'showfilename');
  addClass('container', 'cover');
}

function showModal(argument) {
  addClass('modal', 'showmodal');
  addClass('container', 'cover');
  let xhr = new XMLHttpRequest();
  xhr.open('GET', '/lastfiles');
  xhr.send();
  xhr.onload = () => {
    printFiles(xhr.response);
  }
}

function writeFile(event) {
  if (event !== 13) {
    return;
  }
  let fileName = document.getElementsByClassName('inputfilename')[0].value;
  calculate(fileName);
  removeClass('filename', 'showfilename');
  removeClass('container', 'cover');
}

function printFiles(json) {
  let modal = document.getElementsByClassName('modal')[0];
  html = '';
  if (json === '{}') {
    html += '<p class="choose-file">No files to open</p>';
    modal.innerHTML = html;
    return;
  }
  html += '<p class="choose-file">Choose File</p>';
  let records = JSON.parse(json);
  Object.entries(records).forEach(([key, value]) => {
    html += `<div class="modalfilename" onclick="uploadLatestFile('${key}')">${value}</div>`
  })
  modal.innerHTML = html;
}

function uploadLatestFile(filename) {
  let xhr = new XMLHttpRequest();
  xhr.open('GET', '/openfile' + `?filename=${filename}`);
  xhr.send(filename);
  xhr.onload = () => {
    printHtml(displayPage(xhr.response));
  }
  removeClass('modal', 'showmodal');
  removeClass('container', 'cover');
}

function closeCover(argument) {
  removeClass('container', 'cover');
  removeClass('modal', 'showmodal');
  removeClass('filename', 'showfilename');
}