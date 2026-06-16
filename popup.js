const codeBox = document.getElementById("codeBox");
const timestamp = document.getElementById("timestamp");
const statusEl = document.getElementById("status");
const statusText = document.getElementById("statusText");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const copyFeedback = document.getElementById("copyFeedback");

function setCode(code, ts) {
  if (code) {
    codeBox.textContent = code;
    codeBox.classList.remove("empty");
    timestamp.textContent = ts ? `Fångad: ${ts}` : "";
    statusEl.classList.add("active");
    statusText.textContent = "Kod fångad!";
    copyBtn.disabled = false;
    clearBtn.disabled = false;
  } else {
    codeBox.textContent = "Ingen kod fångad ännu";
    codeBox.classList.add("empty");
    timestamp.textContent = "";
    statusEl.classList.remove("active");
    statusText.textContent = "Väntar på login-redirect...";
    copyBtn.disabled = true;
    clearBtn.disabled = true;
  }
}

// Hämta aktuell kod vid öppning av popup
browser.runtime.sendMessage({ type: "getCode" }).then((response) => {
  setCode(response.code, response.timestamp);
});

copyBtn.addEventListener("click", () => {
  const text = codeBox.textContent;
  navigator.clipboard.writeText(text).then(() => {
    copyFeedback.textContent = "✓ Kopierad till urklipp!";
    setTimeout(() => { copyFeedback.textContent = ""; }, 2500);
  });
});

clearBtn.addEventListener("click", () => {
  browser.runtime.sendMessage({ type: "clearCode" }).then(() => {
    setCode(null, null);
    copyFeedback.textContent = "";
  });
});
