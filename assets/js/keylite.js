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
  alert(text);
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
