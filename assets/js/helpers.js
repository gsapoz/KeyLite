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

  const sentences = [];
  for (let i = 0; i < textContent.length; i++) {
    textContent[i].items.forEach((item) => {
      if (item.str == " " || item.str == "") {
      } else {
        // console.log(item.str);
        sentences.push(item.str);
      }
    });
  }

  const paragraphs = compileParagraphs(sentences);

  // // Concatenate the text content of all pages
  // let text = textContent
  //   .map((content) => content.items.map((item) => item.str).join(" "))
  //   .join("");

  // Return the extracted text
  // return text;

  return paragraphs;
}

function createPageFromText(paragraphs) {
  // Create a new HTML document
  let html = `<html><head><meta charset="utf-8"><title>Your KeyLite PDF</title></head><body>`;
  paragraphs.forEach((item) => {
    const paragraph = item.replace(/â€™/g, "'"); //encode string for readability
    html += `<p>${paragraph}</p>`;
  });
  html += `<style>html {background: darkgrey;}
          body {background: ghostwhite;width: 84%; 
          margin: auto;margin-top: 65px;padding: 50px; 
          border: 1px solid black;border-radius: 5px; }
          p {font-size:25px;}</style></body></html>`;

  // Create a new blob from the HTML string
  const blob = new Blob([html], { type: "text/html" });

  // Create a URL for the blob
  const url = URL.createObjectURL(blob);

  // Open the URL in a new tab
  window.open(url, "_blank");

  // Clean up the URL object
  URL.revokeObjectURL(url);
}

function compileParagraphs(strArray) {
  const doctype = document.getElementById("docType").value;
  const paragraphs = [];

  if (doctype == "Resume") {
    // combine bullet points with all the text after the bullet point
  } else if (doctype == "Itinerary") {
    // look out for hyphens and other special characters that would need removing
  } else {
    // Go Nuts
  }

  let nodeIndex = 0;
  // console.log(strArray);
  strArray.forEach((item) => {
    if (nodeIndex == 0) {
      paragraphs.push(item);
      nodeIndex++;
    } else {
      let startsWithLowercase = /^[a-z]/.test(item);

      //If it starts with a lowercase, contenate to last sentence
      if (startsWithLowercase) {
        let startsWithOneLetter = /^[a-zA-Z]\b/.test(item);
        if (startsWithOneLetter) {
          paragraphs[nodeIndex - 1] += item;
        } else {
          paragraphs[nodeIndex - 1] += " " + item;
        }
        // nodeIndex++;
      }
      //If it starts with the word "undefined", remove that and contenate
      else if (item.split(" ")[0] == "undefined") {
        item.replace("undefined", "");
        paragraphs[nodeIndex - 1] += item;
        nodeIndex++;
      }
      //If it starts with a bullet point, keep looping until the next one, or next word
      else {
        nodeIndex++;
        paragraphs.push(item);
      }
    }
  });

  // console.log(paragraphs);

  return paragraphs;
}
