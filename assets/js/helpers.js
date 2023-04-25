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

  return paragraphs;
}

function createPageFromText(paragraphs) {
  // Create a new HTML document
  let html = `<html><head><meta charset="utf-8"><title>Your KeyLite PDF</title></head><body>`;
  paragraphs.forEach((item) => {
    let paragraph = item.replace(/â€™/g, "'"); //encode string for readability
    paragraph = boldenFirstThreeLetters(paragraph);
    html += `<p>${paragraph}</p>`;
  });
  html += `<style>html {background: darkgrey;}
          body {background: ghostwhite;width: 84%; 
          margin: auto;margin-top: 65px;margin-bottom: 65px;
          padding: 50px; border: 1px solid black;
          border-radius: 5px; } p {font-size:25px;}
          </style></body></html>`;

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

function openPrivacyPolicy() {
  let text1 =
    "KeyLite doesn't save or store user information, document contents, or any other data enetered into the form field. All data is processed locally and on-demand, within the user's browser, and is never transmitted to our servers or any third-party servers. Therefore, once you submit a prompt with KeyLite, you will need to fill out this form field again. ";
  let text2 =
    "For anymore information regarding our privacy policy, please feel free to message me directly at my personal email address: gtech235@gmail.com";
  let text3 = "Have a good day!";
  paragraph1 = boldenFirstThreeLetters(text1);
  paragraph2 = boldenFirstThreeLetters(text2);
  heading = highlightKeyText(text3);
  let html = `<html><head><meta charset="utf-8"><title>Privacy Policy | KeyLite</title>
          </head><body>
          <p>${paragraph1}</p><p>${paragraph2}</p><p>${heading}</p>
          <style>html {background: darkgrey;}
          body {background: ghostwhite;width: 84%; 
          margin: auto;margin-top: 65px;margin-bottom: 65px;
          padding: 50px; border: 1px solid black;
          border-radius: 5px; } p {font-size:25px;}
          </style></body></html>`;

  // Create a new blob from the HTML string
  const blob = new Blob([html], { type: "text/html" });

  // Create a URL for the blob
  const url = URL.createObjectURL(blob);

  // Open the URL in a new tab
  window.open(url, "_blank");

  // Clean up the URL object
  URL.revokeObjectURL(url);
}
