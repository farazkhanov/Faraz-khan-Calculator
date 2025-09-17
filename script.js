let expr = document.getElementById("expr");
let value = document.getElementById("value");

let current = "0";
let previous = null;
let op = null;
let overwrite = true;

function updateScreen() {
  expr.textContent = previous && op ? previous + " " + op : "";
  value.textContent = current;
}

document.getElementById("pad").addEventListener("click", (e) => {
  if (!e.target.classList.contains("key")) return;

  const num = e.target.dataset.num;
  const action = e.target.dataset.action;
  const val = e.target.dataset.value;

  if (num !== undefined) {
    if (overwrite) current = num;
    else current += num;
    overwrite = false;
  } else if (action === "clear") {
    current = "0";
    previous = null;
    op = null;
  } else if (action === "sign") {
    current = (parseFloat(current) * -1).toString();
  } else if (action === "percent") {
    current = (parseFloat(current) / 100).toString();
    overwrite = true;
  } else if (action === "op") {
    if (previous === null) previous = current;
    else if (!overwrite) previous = compute(previous, current, op);
    op = val;
    overwrite = true;
    current = previous;
  } else if (action === "equals") {
    if (op && previous !== null) {
      current = compute(previous, current, op);
      previous = null;
      op = null;
      overwrite = true;
    }
  }

  updateScreen();
});

function compute(a, b, operator) {
  const x = parseFloat(a);
  const y = parseFloat(b);
  let r = 0;
  switch (operator) {
    case "+":
      r = x + y;
      break;
    case "-":
      r = x - y;
      break;
    case "*":
      r = x * y;
      break;
    case "/":
      r = y === 0 ? "Error" : x / y;
      break;
    default:
      r = y;
  }
  if (typeof r === "number") {
    r = Math.round((r + Number.EPSILON) * 1e12) / 1e12;
  }
  return r.toString();
}

// Keyboard support
window.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") simulate click(`[data-num="${e.key}"]`);
  else if (e.key === ".") simulateClick('[data-num="."]');
  else if (e.key === "Enter" || e.key === "=")
    simulateClick('[data-action="equals"]');
  else if (e.key === "Backspace") {
    current = current.length > 1 ? current.slice(0, -1) : "0";
    updateScreen();
  } else if (e.key === "Escape") simulateClick('[data-action="clear"]');
  else if (e.key === "%") simulateClick('[data-action="percent"]');
  else if (["+", "-", "*", "/"].includes(e.key))
    simulateClick(`[data-action="op"][data-value="${e.key}"]`);
});

function simulateClick(selector) {
  const btn = document.querySelector(selector);
  if (!btn) return;
  btn.click();
}

updateScreen();
