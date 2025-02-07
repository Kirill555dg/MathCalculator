import '../pages/index.css';

const display = document.querySelector("#screen");
const keyboard = document.querySelector(".calculator__keyboard");

let openBrackets = 0; // Счётчик открытых скобок

function updateDisplay(value) {
  const lastChar = display.textContent.slice(-1);
  const prevPart = display.textContent.match(/(\d+(\.\d*)?)$/)?.[0] || "";

  // Замена последнего оператора при новом вводе операции
  if ("+-×÷^.".includes(value) && "+-×÷^.".includes(lastChar)) {
    display.textContent = display.textContent.slice(0, -1) + value;
    saveToLocalStorage();
    return;
  }

  // Разрешаем `0.01`, `0.0001`, но запрещаем `000`
  if (prevPart === "0" && value !== "." && !lastChar.includes(".")) {
    if (/\d/.test(value)) {
      display.textContent = display.textContent.slice(0, -1); // Убираем лишний `0`
    }
  }

  // Если вводится `.`, проверяем, чтобы он был только один в числе
  if (value === "." && prevPart.includes(".")) {
    return;
  }

  // Если на экране "0", заменяем его только при вводе цифры или `(`
  if (display.textContent === "0" && (/\d/.test(value) || value === "(")) {
    display.textContent = value;
  } else {
    display.textContent += value;
  }

  saveToLocalStorage();
}



function insertPower(value) {
  const lastChar = display.textContent.slice(-1);

  // Разрешаем `^` после числа или `)`
  if (/\d$/.test(lastChar) || lastChar === ")") {
    display.textContent += "^" + value;
    saveToLocalStorage();
  }
}

function insertBracket(value) {
  const lastChar = display.textContent.slice(-1);

  if (value === "(") {
    // Открывающая скобка разрешена после оператора или в начале
    if (display.textContent === "0" || "+-×÷^(".includes(lastChar)) {
      display.textContent = display.textContent === "0" ? "(" : display.textContent + "(";
      openBrackets++;
    }
  } else if (value === ")") {
    // Нельзя закрывать скобку, если нет открытой
    if (openBrackets === 0 || "+-×÷^(".includes(lastChar)) return;

    display.textContent += ")";
    openBrackets--;
  }

  saveToLocalStorage();
}

function calculate() {
  let expression = display.textContent
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/\^/g, "**"); // Заменяем `^` на `**` для eval()

  // Удаляем операции в конце выражения
  expression = expression.replace(/[\+\-\*\/\^\.]+$/, '');

  // Если выражение пустое после очистки
  if (!expression) {
    display.textContent = "0";
    return;
  }

  try {
    // Если выражение содержит посторонние символы
    if (/[^0-9+\-*/^().e\s]/.test(expression)) {
      display.textContent = "Ошибка";
      return;
    }

    let result = eval(expression);
    display.textContent = Number.isFinite(result) ? result : "Infinity";
    openBrackets = 0;
  } catch {
    display.textContent = "Ошибка";
  }

  saveToLocalStorage();
}


function clearDisplay() {
  display.textContent = "0";
  openBrackets = 0;
  saveToLocalStorage();
}

function deleteLastChar() {
  const lastChar = display.textContent.slice(-1);

  if (lastChar === "(") {
    openBrackets--;
  } else if (lastChar === ")") {
    openBrackets++;
  }

  display.textContent = display.textContent.slice(0, -1) || "0";
  saveToLocalStorage();
}

function saveToLocalStorage() {
  localStorage.setItem("calculatorDisplay", display.textContent);
  localStorage.setItem("openBrackets", openBrackets);
}

function loadFromLocalStorage() {
  const savedValue = localStorage.getItem("calculatorDisplay");
  const savedBrackets = localStorage.getItem("openBrackets");

  if (savedValue !== null) {
    display.textContent = savedValue;
  }
  if (savedBrackets !== null) {
    openBrackets = parseInt(savedBrackets);
  }
}

// Загружаем сохранённое значение при запуске
loadFromLocalStorage();

keyboard.addEventListener("click", (event) => {
  const button = event.target;
  if (!button.classList.contains("calculator__button")) return;

  if (["Ошибка", "Infinity"].includes(display.textContent)) {
    clearDisplay();
  }

  const action = button.dataset.action;
  const value = button.textContent;

  if (action === "number") {
    updateDisplay(value);
  } else if (["add", "subtract", "multiply", "divide"].includes(action)) {
    updateDisplay(value);
  } else if (action === "power") {
    insertPower("");
  } else if (action === "square") {
    insertPower("2");
  } else if (action === "sqrt") {
    insertPower("0.5");
  } else if (action === "clear") {
    clearDisplay();
  } else if (action === "delete") {
    deleteLastChar();
  } else if (action === "bracket") {
    insertBracket(value);
  } else if (action === "calculate") {
    calculate();
  }
});

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (["Ошибка", "Infinity"].includes(display.textContent)) {
    clearDisplay();
  }

  if (!isNaN(key) || "+-*/.".includes(key)) {
    updateDisplay(key.replace("*", "×").replace("/", "÷"));
  } else if (key === "^") {
    insertPower("");
  } else if (key === "(" || key === ")") {
    insertBracket(key);
  } else if (key === "Enter") {
    event.preventDefault();
    calculate();
  } else if (key === "Backspace") {
    deleteLastChar();
  } else if (key === "Escape") {
    clearDisplay();
  }
});
