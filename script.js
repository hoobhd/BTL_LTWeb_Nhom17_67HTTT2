let currentInput = '0';
let previousInput = null;
let operator = null;
let shouldResetScreen = false;

const displayEl = document.getElementById('display');
const historyEl = document.getElementById('history');

function updateDisplay() {
    displayEl.textContent = currentInput;
}

function inputDigit(digit) {
    if (shouldResetScreen) {
        currentInput = digit;
        shouldResetScreen = false;
    } else {
        currentInput = currentInput === '0' ? digit : currentInput + digit;
    }
    updateDisplay();
}

function inputDecimal() {
    if (shouldResetScreen) {
        currentInput = '0.';
        shouldResetScreen = false;
        updateDisplay();
        return;
    }
    if (!currentInput.includes('.')) {
        currentInput += '.';
        updateDisplay();
    }
}

function clearEntry() {
    currentInput = '0';
    updateDisplay();
}

function clearAll() {
    currentInput = '0';
    previousInput = null;
    operator = null;
    shouldResetScreen = false;
    historyEl.textContent = '';
    updateDisplay();
}

function backspace() {
    if (shouldResetScreen) return;
    if (currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

function toggleSign() {
    if (currentInput === '0') return;
    currentInput = currentInput.startsWith('-') 
        ? currentInput.slice(1) 
        : '-' + currentInput;
    updateDisplay();
}

function chooseOperator(op) {
    const opSymbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    
    if (operator !== null && !shouldResetScreen) {
        compute();
    }
    previousInput = parseFloat(currentInput);
    operator = op;
    shouldResetScreen = true;
    historyEl.textContent = `${previousInput} ${opSymbols[op]}`;
}

function compute() {
    if (operator === null || shouldResetScreen) return;
    
    const current = parseFloat(currentInput);
    const opSymbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
    let result;

    switch (operator) {
        case '+': result = previousInput + current; break;
        case '-': result = previousInput - current; break;
        case '*': result = previousInput * current; break;
        case '/':
            if (current === 0) {
                currentInput = 'Lỗi chia 0';
                historyEl.textContent = '';
                operator = null;
                shouldResetScreen = true;
                updateDisplay();
                return;
            }
            result = previousInput / current;
            break;
    }

    historyEl.textContent = `${previousInput} ${opSymbols[operator]} ${current} =`;
    currentInput = String(Math.round(result * 1e10) / 1e10);
    operator = null;
    shouldResetScreen = true;
    updateDisplay();
}