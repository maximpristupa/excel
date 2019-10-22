String.prototype.isNumeric = function() {
    return !isNaN(parseFloat(this)) && isFinite(this);
}

Array.prototype.clean = function() {
    for(let i = 0; i < this.length; i++) {
        if(this[i] === "") {
            this.splice(i, 1);
        }
    }
    return this;
}

function expressionToRpn(expression) {
        let outputQueue = "";
        let operatorStack = [];
        let operators = {
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
        expression = expression.replace(/\s+/g, "");
        expression = expression.split(/([\+\-\*\/\^\(\)])/).clean();
        for(let i = 0; i < expression.length; i++) {
            let token = expression[i];
            if(token.isNumeric()) {
                outputQueue += token + " ";
            } else if("^*/+-".indexOf(token) !== -1) {
                let o1 = token;
                let o2 = operatorStack[operatorStack.length - 1];
                while("^*/+-".indexOf(o2) !== -1 && ((operators[o1].associativity === "Left" && operators[o1].precedence <= operators[o2].precedence) || (operators[o1].associativity === "Right" && operators[o1].precedence < operators[o2].precedence))) {
                    outputQueue += operatorStack.pop() + " ";
                    o2 = operatorStack[operatorStack.length - 1];
                }
                operatorStack.push(o1);
            } else if(token === "(") {
                operatorStack.push(token);
            } else if(token === ")") {
                while(operatorStack[operatorStack.length - 1] !== "(") {
                    outputQueue += operatorStack.pop() + " ";
                }
                operatorStack.pop();
            }
        }
        while(operatorStack.length > 0) {
            outputQueue += operatorStack.pop() + " ";
        }
        return outputQueue.replace('^', '**');
    }

function calculateRpnExpression(str) {
    s = []
    str.split(' ').forEach(t =>
        s.push(t == +t ? t : eval(s.splice(-2,1)[0] + t + s.pop())));
    return s[0];
}


function evaluate(expression) {
    let str = expressionToRpn(expression)
    return calculateRpnExpression(str)
}

module.exports.evaluate = evaluate