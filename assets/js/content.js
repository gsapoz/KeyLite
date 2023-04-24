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
