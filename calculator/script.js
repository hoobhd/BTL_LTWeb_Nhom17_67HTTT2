// ====== Các biến lưu trạng thái của máy tính ======
let current = "0";      // Số đang hiển thị trên màn hình
let previous = null;    // Số đã nhập trước đó (số thứ nhất của phép tính)
let operator = null;    // Phép tính đang chọn: "+", "-", "*" hoặc "/"
let startNew = false;   // true nghĩa là lần bấm số tiếp theo sẽ bắt đầu số mới

// Lấy 2 phần tử trên màn hình để cập nhật nội dung
const display = document.getElementById("display");
const expression = document.getElementById("expression");

// Hiển thị số hiện tại lên màn hình
function updateScreen() {
  display.textContent = current;
}

// ====== Hàm tính toán ======
function calculate(a, op, b) {
  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "*") return a * b;
  if (op === "/") return a / b;
}

// Làm tròn để tránh lỗi như 0.1 + 0.2 = 0.30000000000000004
function roundResult(number) {
  return parseFloat(number.toFixed(10));
}

// Đổi ký hiệu phép tính để hiển thị đẹp hơn
function symbol(op) {
  if (op === "*") return "×";
  if (op === "/") return "÷";
  if (op === "-") return "−";
  return op;
}

// Báo lỗi khi chia cho 0 rồi đặt lại máy tính
function showError() {
  current = "0";
  previous = null;
  operator = null;
  startNew = true;
  expression.textContent = "";
  display.textContent = "Không chia được cho 0";
}

// ====== Các hàm gắn với nút bấm ======

// Bấm số 0-9
function pressNumber(digit) {
  if (startNew) {
    current = digit;
    startNew = false;
  } else if (current === "0") {
    current = digit;
  } else {
    current = current + digit;
  }
  updateScreen();
}

// Bấm dấu chấm thập phân
function pressDot() {
  if (startNew) {
    current = "0.";
    startNew = false;
  } else if (!current.includes(".")) {
    current = current + ".";
  }
  updateScreen();
}

// Bấm phép tính + - × ÷
function pressOperator(op) {
  // Nếu đã có phép tính trước đó thì tính luôn (ví dụ 2 + 3 + ...)
  if (operator !== null && !startNew) {
    let result = calculate(previous, operator, parseFloat(current));
    if (operator === "/" && parseFloat(current) === 0) {
      showError();
      return;
    }
    previous = roundResult(result);
  } else {
    previous = parseFloat(current);
  }

  operator = op;
  startNew = true;
  current = String(previous);
  expression.textContent = previous + " " + symbol(op);
  updateScreen();
}

// Bấm dấu =
function equals() {
  if (operator === null) return;

  let a = previous;
  let b = parseFloat(current);

  if (operator === "/" && b === 0) {
    showError();
    return;
  }

  let result = roundResult(calculate(a, operator, b));
  expression.textContent = a + " " + symbol(operator) + " " + b + " =";

  current = String(result);
  previous = null;
  operator = null;
  startNew = true;
  updateScreen();
}

// Bấm C: xóa tất cả
function clearAll() {
  current = "0";
  previous = null;
  operator = null;
  startNew = false;
  expression.textContent = "";
  updateScreen();
}

// Bấm ⌫: xóa chữ số cuối
function backspace() {
  if (startNew) return;
  if (current.length > 1) {
    current = current.slice(0, -1);
  } else {
    current = "0";
  }
  updateScreen();
}

// Bấm %: chia số hiện tại cho 100
function percent() {
  current = String(roundResult(parseFloat(current) / 100));
  startNew = true;
  updateScreen();
}

// Bấm ±: đổi dấu dương/âm
function toggleSign() {
  if (current === "0") return;
  if (current.startsWith("-")) {
    current = current.slice(1);
  } else {
    current = "-" + current;
  }
  updateScreen();
}
