var url_path = window.location.pathname;

console.log("Is viewing content: " + isViewingContent(url_path));
console.log("File name: " + getFileName());
console.log("Is a PDF: " + isPDF());
console.log("Is a DOCX: " + isDOCX());
console.log("Is a TXT: " + isTXT());


// Returns true if user is viewing a 
// file to download, false otherwise
function isViewingContent(url_path) {
  // if path contains "viewContent"
  if (url_path.indexOf("viewContent") > -1) {
    return true;
  }
  return false;
}

////////////////////
// FILE FUNCTIONS //
////////////////////

// Return name of file, no extension
function getFileName() {
  var nametag = document.getElementsByClassName("vui-heading-1")[0];
  var no_preview = isNoPreviewFile();
  if (no_preview) {
    return no_preview;
  }
  
  var name = nametag.innerText;
  var ext = determineExt();
  
  return name + ext;
}

// Returns extension as string
// Ex: .pdf
// Or empty string if it's an other file
function determineExt() {
  var ext;
  
  if (isPDF()) {
    ext = ".pdf";
  } else if (isDOCX()) {
    ext = ".docx";
  } else if (isTXT()) {
    ext = ".txt";
  } else {
    ext = "";
  }
  return ext;
}

// Returns true if viewing PDF
function isPDF() {
  var pdfs = document.getElementsByClassName("d2l-fileviewer-pdf");
  if (pdfs.length == 1) {
    return true;
  }
  return false;
}

// Returns true if viewing .docx file
// I really couldn't think of a better way to do this
function isDOCX() {
  var body = document.getElementsByTagName("body")[0].innerHTML;
  if (body.indexOf(".docx") != -1) {
    return true;
  }
  return false;
}

// Returns true if viewing a .txt file
function isTXT() {
  var txt = document.getElementsByClassName("d2l-fileviewer-text");
  if (txt.length == 1) {
    return true;
  }
  return false;
}

// Returns file name if it is a no preview file
// Returns null otherwise
function isNoPreviewFile() {
  var div = document.getElementsByClassName("d2l-textblock d2l-textblock-strong d2l-left")[0];
  if (div) {
    return div.innerText;
  } return null;
}