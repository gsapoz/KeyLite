// Declare Form Submit Buttons
let btnOpen = document.getElementById("openPDF");
let btnUpdate = document.getElementById("updatePDF");

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  // Get the URL of the current tab
  var currentUrl = tabs[0].url;

  // Get the pathname of the current tab
  var currentPathname = new URL(currentUrl).pathname;

  if (currentPathname.toLocaleLowerCase().endsWith(".pdf")) {
    btnOpen.classList.add("inactive");
    btnUpdate.addEventListener("click", () => {
      // Call the extractPdfText function with the PDF file URL
      extractPdfText(currentUrl)
        .then((text) => {
          createPageFromText(text);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  } else {
    btnUpdate.classList.add("inactive");
    btnOpen.addEventListener("click", () => {
      let input = document.createElement("input");
      input.type = "file";
      input.accept = "application/pdf";
      input.click();

      input.addEventListener("change", () => {
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        // Get the original file name and append it to the URL
        let fileName = file.name;
        let newUrl = url + "#" + fileName;

        // Call the extractPdfText function with the PDF file URL
        extractPdfText(newUrl)
          .then((text) => {
            createPageFromText(text);
          })
          .catch((error) => {
            console.error(error);
          });
      });
    });
  }
});

// Create a function to extract text from a PDF file
async function extractPdfText(pdfUrl) {
  // Load the PDF document
  const loadingTask = pdfjsLib.getDocument(pdfUrl);
  const pdfDocument = await loadingTask.promise;

  // Get the text content of each page
  const textContent = [];
  for (let i = 1; i <= pdfDocument.numPages; i++) {
    const page = await pdfDocument.getPage(i);
    const content = await page.getTextContent();
    textContent.push(content);
  }

  // Concatenate the text content of all pages
  const text = textContent
    .map((content) => content.items.map((item) => item.str).join(""))
    .join("");

  // Return the extracted text
  return text;
}

function createPageFromText(text) {
  // Create a new HTML document
  const html = `
    <html>
      <head>
        <title>Extracted Text</title>
      </head>
      <body>
        <p>${text}</p>
        <style>
          html {
            background: darkgrey;    
          }
          body {
            background: ghostwhite;
            height: 200vh; 
            width: 84%;
            margin: auto;
            margin-top: 65px;
            padding: 50px;
            border: 1px solid black;
            border-radius: 5px;
          }
          p { 
            font-size:25px;
          }
        </style>
      </body>
    </html>
  `;

  // Create a new blob from the HTML string
  const blob = new Blob([html], { type: "text/html" });

  // Create a URL for the blob
  const url = URL.createObjectURL(blob);

  // Open the URL in a new tab
  window.open(url, "_blank");

  // Clean up the URL object
  URL.revokeObjectURL(url);
}

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

// Add a listener for the KeyLite button
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == "runKeyLite") {
    runKeyLite();
    // alert("running keyLite");
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
