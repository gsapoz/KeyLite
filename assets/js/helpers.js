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
  let text = textContent
    .map((content) => content.items.map((item) => item.str).join(" "))
    .join("");

  // Return the extracted text
  return text;
}

function compileArrayFromText(text) {
  const regex = /[^\w\s\.\,\-\(\)]/g;
  text = text.replace(regex, "");
  alert(text);
}

function createPageFromText(text) {
  const regex = /[^\w\s\.\,\-\(\)]/g;
  text = text.replace(regex, "");

  // text = splitIntoSentences(text)
  text = removeHyphens(text);
  text = boldenFirstThreeLetters(text);
  text = highlightKeyText(text);

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
