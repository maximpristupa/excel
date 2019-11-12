"use strict";

const RIGHT = 'Right'
const LEFT = 'Left'

const operators = {
    '^': {
        precedence: 4,
        associativity: RIGHT
    },
    '/': {
        precedence: 3,
        associativity: LEFT
    },
    '*': {
        precedence: 3,
        associativity: LEFT
    },
    '+': {
        precedence: 2,
        associativity: LEFT
    },
    '-': {
        precedence: 2,
        associativity: LEFT
    }
}

function expressionToRpn(expression) {
    let outputQueue = '';
    let operatorStack = [];
    expression = expression.replace(/\s+/g, '');
    let elements = expression.split(/([\+\-\*\/\^\(\)])/).filter(character => character)
    elements.forEach((item) => {
        let token = item;
        if (token === `${+token}`) {
            outputQueue += `${token} `;
            return;
        } 
        if ("^*/+-".indexOf(token) !== -1) {
            let o1 = token;
            let o2 = operatorStack[operatorStack.length - 1];
            while (operator(o1,o2)) {
                outputQueue += `${operatorStack.pop()} `;
                o2 = operatorStack[operatorStack.length - 1];
            }
            operatorStack.push(o1);
            return;
        } 
        if (token === '(') {
            operatorStack.push(token);
            return;
        } 
        if (token === ')') {
            while (operatorStack[operatorStack.length - 1] !== '(') {
                outputQueue += `${operatorStack.pop()} `;
            }
            operatorStack.pop();
            return;
        }

    });
    while (operatorStack.length > 0) {
        outputQueue += `${operatorStack.pop()} `;
    }
    return outputQueue.replace('^', '**');
}

function operator(o1,o2) {
   return "^*/+-".indexOf(o2) !== -1 && ((operators[o1].associativity === LEFT && operators[o1].precedence <= operators[o2].precedence) || (operators[o1].associativity === RIGHT && operators[o1].precedence < operators[o2].precedence))
}

function calculateRpnExpression(str) {
    let result = [];
    const expression = str.split(' ');
    expression.forEach((item) => {
        switch (item) {
          case `${+item}`:
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
          default:
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

