console.log(window.chrome);

// Define a function to bolden the first three letters of each word in a string
function boldenFirstThreeLetters(str) {
  var words = str.split(" ");
  for (var i = 0; i < words.length; i++) {
    if (words[i].length > 3) {
      words[i] =
        "<strong>" + words[i].substr(0, 3) + "</strong>" + words[i].substr(3);
    } else {
      words[i] = "<strong>" + words[i] + "</strong>";
    }
  }
  return words.join(" ");
}

// Define a function to highlight key text in a string
function highlightKeyText(str, keywords, color) {
  var pattern = new RegExp(keywords.join("|"), "gi");
  return str.replace(pattern, function (match) {
    return '<span style="background-color:' + color + ';">' + match + "</span>";
  });
}

// Define the main function that runs when the KeyLite button is clicked
function runKeyLite() {
  var boldColor = "#000";
  var highlightColor = "#ffff00";
  var keywords = ["key", "important", "critical"];
  var text = window.getSelection().toString();
  if (text.length > 0) {
    var boldedText = boldenFirstThreeLetters(text);
    var highlightedText = highlightKeyText(
      boldedText,
      keywords,
      highlightColor
    );
    var newContent = highlightedText;
    var selection = window.getSelection();
    var range = selection.getRangeAt(0);
    var node = document.createElement("span");
    node.innerHTML = newContent;
    range.deleteContents();
    range.insertNode(node);
    selection.removeAllRanges();
    selection.addRange(range);
  }
}

// Add a listener for the KeyLite button
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == "runKeyLite") {
    runKeyLite();
  }
});

// Add a listener for the settings
chrome.storage.sync.get(
  {
    boldColor: "#000",
    highlightColor: "#ffff00",
    keywords: ["key", "important", "critical"],
  },
  function (items) {
    boldColor = items.boldColor;
    highlightColor = items.highlightColor;
    keywords = items.keywords;
  }
);

// Add a listener for changes to the settings
chrome.storage.onChanged.addListener(function (changes, areaName) {
  if (areaName == "sync") {
    if (changes.boldColor) {
      boldColor = changes.boldColor.newValue;
    }
    if (changes.highlightColor) {
      highlightColor = changes.highlightColor.newValue;
    }
    if (changes.keywords) {
      keywords = changes.keywords.newValue;
    }
  }
});
