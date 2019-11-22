function upload(file) {
  let formData = new FormData(document.forms.uploadFile);
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/uploadfile");
  xhr.send(formData);

  xhr.onload = () => printHtml(displayPage(xhr.response));
}

function displayPage(response = null) {
  if (!response) {return;}
  let csv = JSON.parse(response)
  let charCodeAt = 'A'.charCodeAt(0);
  let rowNumber = 1;
  let html = ''
  html += '<form name="extable" class="extable">';
  csv.forEach((row, rowIndex) => {
      if (rowIndex === 0) {
        let rowLetter = '';
        rowLetter += '<div class="row letterRow">';
        for (let i = 0; i < row.length; i++) {
          rowLetter += `<div class="letterCell">${String.fromCharCode(charCodeAt)}</div>`;
          charCodeAt += 1;
        }
		rowLetter += '</div>';
        html += rowLetter;
      }
      html += '<div class="row">';
      html += `<div class="numberRow">${rowNumber}</div>`;
      rowNumber += 1;
      row.forEach((cell) => {
          html += `<div class="cell"> <input class="cellInput cell" onkeydown = "if (event.keyCode == 13) calculate()" type="text" name="cell" value="${cell}"> </div>`;
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

function calculate() {
  let formData = new FormData(document.forms.extable);
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/calculate");
  xhr.send(formData);

  xhr.onload = () => printHtml(displayPage(xhr.response));
}
