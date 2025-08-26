   class Calculator {
            constructor(displayElement, historyElement) {
                this.displayElement = displayElement;
                this.historyElement = historyElement;
                this.historyClearTimerId = null; 
                this.clearCalculator(); 
            }
            clearCalculator() {
                this.currentInput = '0';
                this.firstOperand = null;
                this.operator = null;
                this.waitingForSecondOperand = false;
                this.calculationHistory = []; 
                this.updateHistory(); 
                this.resetHistoryTimer();
            }
            appendNumber = (number) => {
                this.resetHistoryTimer();

                if (this.waitingForSecondOperand) {
                    this.currentInput = number;
                    this.waitingForSecondOperand = false;
                } else {
                    if (number === '.' && this.currentInput.includes('.')) {
                        return; 
                    }
                    this.currentInput = this.currentInput === '0' && number !== '.' ? number : this.currentInput + number;
                }
            }
            updateDisplay = () => {
                this.displayElement.value = this.currentInput;
            }
            performOperation = (nextOperator) => {
                this.resetHistoryTimer();
                const inputValue = parseFloat(this.currentInput);
                if (this.operator === '/' && inputValue === 0) {
                    this.displayElement.value = "Error: Div by zero";
                    this.clearCalculator(); 
                    return;
                }
                if (this.firstOperand === null) {
                    this.firstOperand = inputValue;
                } else if (this.operator && !this.waitingForSecondOperand) {
                    let result;
                    let calculationString = `${this.firstOperand} ${this.operator} ${inputValue}`;

                    switch (this.operator) {
                        case '+':
                            result = this.firstOperand + inputValue;
                            break;
                        case '-':
                            result = this.firstOperand - inputValue;
                            break;
                        case '*':
                            result = this.firstOperand * inputValue;
                            break;
                        case '/':
                            result = this.firstOperand / inputValue;
                            break;
                        default:
                            return;
                    }
                    this.firstOperand = result;
                    this.currentInput = String(result);
                    this.calculationHistory.push(`${calculationString} = ${result}`);
                    this.updateHistory();
                }

                this.waitingForSecondOperand = true;
                this.operator = nextOperator;
                this.updateDisplay();
            }
            calculatePercentage = () => {
                this.resetHistoryTimer();
                const value = parseFloat(this.currentInput);
                if (!isNaN(value)) {
                    this.currentInput = String(value / 100);
                    this.updateDisplay();
                }
            }
            toggleSign = () => {
                this.resetHistoryTimer();
                const value = parseFloat(this.currentInput);
                if (!isNaN(value) && value !== 0) {
                    this.currentInput = String(-value);
                    this.updateDisplay();
                }
            }
            updateHistory = () => {
                this.historyElement.innerHTML = '<h4>Calculation History</h4>'; 
                for (const entry of this.calculationHistory) { 
                    const p = document.createElement('p'); 
                    p.textContent = entry; 
                    this.historyElement.appendChild(p); 
                }
            }
            resetHistoryTimer = () => {
                clearTimeout(this.historyClearTimerId);
                this.historyClearTimerId = setTimeout(() => {
                    this.calculationHistory = [];
                    this.updateHistory();
                    console.log('Calculation history cleared due to inactivity.');
                }, 30000); 
            }
        }
        const displayElement = document.getElementById('display');
        const buttonsContainer = document.getElementById('buttons-container');
        const historyElement = document.getElementById('history');
        const calculator = new Calculator(displayElement, historyElement);
        buttonsContainer.addEventListener('click', (event) => {
            const target = event.target;

            if (target.tagName === 'BUTTON') {
                const buttonText = target.textContent;

                if (target.classList.contains('clear')) {
                    calculator.clearCalculator();
                } else if (target.classList.contains('operator') && buttonText !== '=') {
                    calculator.performOperation(buttonText);
                } else if (target.classList.contains('equals')) {
                    calculator.performOperation('=');
                } else if (target.id === 'decimal') {
                    calculator.appendNumber('.');
                } else if (target.id === 'percent') {
                    calculator.calculatePercentage();
                } else if (target.id === 'toggleSign') {
                    calculator.toggleSign();
                }
                else { 
                    calculator.appendNumber(buttonText);
                }
                calculator.updateDisplay(); 
            }
        });
        calculator.updateDisplay();

  