const operators = {
    "^": {
        precedence: 4,
        associativity: "Right"
    },
    "/": {
        precedence: 3,
        associativity: "Left"
    },
    "*": {
        precedence: 3,
        associativity: "Left"
    },
    "+": {
        precedence: 2,
        associativity: "Left"
    },
    "-": {
        precedence: 2,
        associativity: "Left"
    }
}

function expressionToRpn(expression) {
    let outputQueue = "";
    let operatorStack = [];
    expression = expression.replace(/\s+/g, "");
    expression = expression.split(/([\+\-\*\/\^\(\)])/).filter(character => character)
    expression.forEach(function(item){
        let token = item;
        if (token === (+token).toString()) {
            outputQueue += token + " ";
        } else if ("^*/+-".indexOf(token) !== -1) {
            let o1 = token;
            let o2 = operatorStack[operatorStack.length - 1];
            while (operator(o1,o2)) {
                outputQueue += operatorStack.pop() + ` `;
                o2 = operatorStack[operatorStack.length - 1];
            }
            operatorStack.push(o1);
        } else if (token === "(") {
            operatorStack.push(token);
        } else if (token === ")") {
            while (operatorStack[operatorStack.length - 1] !== "(") {
                outputQueue += operatorStack.pop() + ` `;
            }
            operatorStack.pop();
        }
    });
    while (operatorStack.length > 0) {
        outputQueue += operatorStack.pop() + ` `;
    }
    return outputQueue.replace('^', '**');
}

function operator(o1,o2) {
   return "^*/+-".indexOf(o2) !== -1 && ((operators[o1].associativity === "Left" && operators[o1].precedence <= operators[o2].precedence) || (operators[o1].associativity === "Right" && operators[o1].precedence < operators[o2].precedence))
}

function calculateRpnExpression(str) {
    result = []
    let expression = str.split(' ')
    expression.forEach(function(item){
        switch (item) {
          case (+item).toString():
            result.push(item);
            break;
          case '+':
            result.push(+result.splice(-2,1)[0] + +result.pop());
            break;
          case '-':
            result.push(+result.splice(-2,1)[0] - +result.pop());
            break;
          case '*':
            result.push(+result.splice(-2,1)[0] * +result.pop());
            break;
          case '/':
            result.push(+result.splice(-2,1)[0] / +result.pop());
            break;
          case '**':
            result.push(Math.pow(+result.splice(-2,1)[0], +result.pop()));
            break;
        }
    });
    return result[0];
}


function evaluate(expression) {
    let str = expressionToRpn(expression)
    return calculateRpnExpression(str)
}

module.exports.evaluate = evaluate

