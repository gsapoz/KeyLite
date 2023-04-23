//Check that the current open tab is a pdf file
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  var tab = tabs[0];
  if (tab.url && tab.url.toLowerCase().endsWith(".pdf")) {
    chrome.tabs.sendMessage(tab.id, { action: "runKeyLite" });
  }
});

self.addEventListener("message", function (event) {
  if (event.data.action == "runKeyLite") {
    runKeyLite();
  }
});
