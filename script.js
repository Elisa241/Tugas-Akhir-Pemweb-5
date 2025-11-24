let currentInput = "";
let memory = 0;
let history = [];

const display = document.getElementById("display");

// ================== UPDATE DISPLAY ==================
function updateDisplay() {
  display.value = currentInput || "0";
}

// ================== INPUT ANGGKA ==================
function appendNumber(num) {
  currentInput += num;
  updateDisplay();
}

// ================== INPUT OPERATOR ==================
function appendOperator(op) {
  if (currentInput === "") return;

  // hapus operator terakhir kalau dobel
  if (/[\+\-\×\÷]\s$/.test(currentInput)) {
    currentInput = currentInput.slice(0, -3);
  }

  currentInput += " " + op + " ";
  updateDisplay();
}

// ================== TITIK DESIMAL ==================
function appendDecimal() {
  let last = currentInput
    .split(/[\+\-\×\÷]/)
    .pop()
    .trim();
  if (!last.includes(".")) {
    currentInput += ".";
    updateDisplay();
  }
}

// ================== CLEAR ALL ==================
function clearAll() {
  currentInput = "";
  updateDisplay();
}

// ================== CLEAR ENTRY (hapus angka terakhir) ==================
function clearEntry() {
  let parts = currentInput.trim().split(" ");

  if (parts.length === 1) {
    currentInput = "";
  } else {
    parts.pop();
    currentInput = parts.join(" ");
  }

  updateDisplay();
}

// ================== DELETE LAST CHAR ==================
function deleteLast() {
  currentInput = currentInput.trim();
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}

// ================== HITUNG ==================
function equals() {
  try {
    if (!currentInput.trim()) return;

    let expr = currentInput.replace(/×/g, "*").replace(/÷/g, "/");

    if (/\/0(?!\.)/.test(expr)) {
      display.value = "Error";
      return;
    }

    let result = Function('"use strict";return (' + expr + ")")();

    addHistory(currentInput + " = " + result);

    currentInput = result.toString();
    updateDisplay();
  } catch {
    display.value = "Error";
    currentInput = "";
  }
}

function calculate() {
  equals();
}

// ================== HISTORY ==================
function addHistory(entry) {
  history.push(entry);
  if (history.length > 5) history.shift();

  document.getElementById("history").innerHTML =
    "<strong>History:</strong><br>" + history.join("<br>");
}

function evalExpression(expr) {
  expr = expr.replace(/×/g, "*").replace(/÷/g, "/");
  return Function('"use strict";return (' + expr + ")")();
}

// ================== MEMORY FUNCTIONS ==================
function memoryClear() {
  memory = 0;
}

function memoryRecall() {
  currentInput = memory.toString();
  updateDisplay();
}

function memoryAdd() {
  if (display.value !== "") {
    memory += parseFloat(display.value);
  }
}

function memorySubtract() {
  if (display.value !== "") {
    memory -= parseFloat(display.value);
  }
}

function memoryStore() {
  if (display.value !== "") {
    memory = parseFloat(display.value);
  }
}

// ================== ± (toggle sign) ==================
function toggleSign() {
  if (!currentInput) return;

  let parts = currentInput.trim().split(" ");
  let last = parts.pop();

  if (last.startsWith("-")) last = last.substring(1);
  else last = "-" + last;

  parts.push(last);
  currentInput = parts.join(" ");
  updateDisplay();
}

// ================== PERSENTASE ==================
function calculatePercentage() {
  if (!currentInput) return;
  let res = evalExpression(currentInput) / 100;
  currentInput = res.toString();
  updateDisplay();
}

// ================== KEYBOARD SUPPORT ==================
document.addEventListener("keydown", (e) => {
  const key = e.key;

  // angka
  if (key >= "0" && key <= "9") appendNumber(key);
  // decimal
  else if (key === ".") appendDecimal();
  // operator
  else if (key === "+") appendOperator("+");
  else if (key === "-") appendOperator("-");
  else if (key === "*") appendOperator("×");
  else if (key === "/") appendOperator("÷");
  // persen
  else if (key === "%") calculatePercentage();
  // ENTER & "=" = sama dengan
  else if (key === "Enter" || key === "=") {
    e.preventDefault();
    equals();
  }

  // Backspace
  else if (key === "Backspace") deleteLast();
  // ESC = CE
  else if (key === "Escape") clearEntry();
  // C = clear All
  else if (key.toLowerCase() === "c") clearAll();
});
