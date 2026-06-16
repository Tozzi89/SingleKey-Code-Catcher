// Sparar den senast fångade koden
let lastCode = null;
let lastTimestamp = null;

browser.webRequest.onHeadersReceived.addListener(
  (details) => {
    const locationHeader = details.responseHeaders.find(
      h => h.name.toLowerCase() === "location"
    );

    if (!locationHeader || !locationHeader.value) return {};

    const location = locationHeader.value;

    // Kolla att det är rätt typ av redirect (custom scheme med code=)
    if (!location.includes("code=")) return {};

    // Extrahera allt från "code=" till nästa "&" (eller slutet)
    const match = location.match(/[?&]code=([^&]+)/);
    if (!match) return {};

    const fullCode = match[1];

    // Bygg ihop hela strängen som användaren vill ha
    // (custom scheme + path + ?code=KOD)
    const schemeAndPath = location.split(/[?&]code=/)[0];
    const codeValue = `${schemeAndPath}?code=${fullCode}`;

    lastCode = codeValue;
    lastTimestamp = new Date().toLocaleTimeString("sv-SE");

    // Uppdatera badge så användaren ser att något fångats
    browser.browserAction.setBadgeText({ text: "NY" });
    browser.browserAction.setBadgeBackgroundColor({ color: "#e63946" });

    return {};
  },
  {
    urls: [
      "*://singlekey-id.com/*",
      "*://*.singlekey-id.com/*"
    ],
    types: ["main_frame", "sub_frame", "xmlhttprequest", "other"]
  },
  ["responseHeaders"]
);

// Lyssna på meddelanden från popup
browser.runtime.onMessage.addListener((msg) => {
  if (msg.type === "getCode") {
    return Promise.resolve({ code: lastCode, timestamp: lastTimestamp });
  }
  if (msg.type === "clearCode") {
    lastCode = null;
    lastTimestamp = null;
    browser.browserAction.setBadgeText({ text: "" });
    return Promise.resolve({ ok: true });
  }
});
