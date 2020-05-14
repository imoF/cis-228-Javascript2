'use strict'

function main() {
  document.addEventListener('DOMContentLoaded', (evnt) => {
    let action = document.getElementById('action');

    action.addEventListener('submit', function (evnt) {
        evnt.preventDefault();

        let num1 = document.getElementById('firstNum').value;
        let num2 = document.getElementById('secondNum').value;
        let sign = document.getElementById('sign').value;

        num1 = Number(num1);
        num2 = Number(num2);
        let value;

        if (sign === "Add") {
                value = add(num1, num2);

        } else if (sign === "Subtract") {
                value = sub(num1, num2);

        } else if (sign === 'Multiply') {
                value = times(num1, num2);

        } else if (sign === "Divide") {
                value = div(num1, num2);

        } else {
                value = '';
        }

        let resultsP = document.getElementById('results');
        resultsP.innerHTML = "";
        resultsP.innerHTML = value;
    }); //end evntL
  });//end ready
}//end main


function add(num1, num2) {
        return num1 + num2;
}//end addition

function sub(num1, num2) {
        return num1 - num2;
}//end subtraction

function times(num1, num2) {
        return num1 * num2;
}//end multiplication

function div(num1, num2) {
        return num1 / num2;
}//end division

main();
