////////////////////
// FILE FUNCTIONS //
////////////////////

function getDownloadLink(cookies) {
  var prefix = "https://mycourses.rit.edu";
  var viewer = document.getElementsByClassName("d2l-fileviewer")[0];
  
  if (viewer) {
    console.log("Trying to get download link directly");
    var divs = viewer.getElementsByTagName("div");
    var fileviewer = null;
    
    for (var i = 0; i < divs.length; i++) {
      if (divs[i].hasAttribute("data-location")) {
        fileviewer = divs[i];
        break;
      }
    }
    
    if (!fileviewer) {
      console.log("No direct link - must be be a Microsoft document");
      return generateDownloadLink(cookies);
    }
    
    console.log("Found direct link");
    
    var path = fileviewer.getAttribute("data-location");
    var path_part = path.split("?");
    
    var link = prefix + path_part[0] +
               "?d2lSecureSessionVal=" + 
               cookies["d2lSecureSessionVal"] + // SecureSession must be first
               "&" + path_part[1]; // incluces d2lSessionVal and ou
    
    console.log("Direct link: " + link);
    
    return link;
  }

}

/**
 * Generates a download link (should work most of the time)
 * The only time this method should be called is when the user is 
 * viewing a Microsoft document. Microsoft documents don't have
 * the same viewer on MyCourses as every other file that has one.
 */
function generateDownloadLink(cookies) {
  console.log("Attempting to generate download link");
  
  var prefix = "https://mycourses.rit.edu/content/enforced2/";
  
  // make sure d2lSecureSession is first
  var cookie_suffix = "?d2lSecureSessionVal=" + cookies["d2lSecureSessionVal"] +
    "&" + "d2lSessionVal=" + cookies["d2lSessionVal"];
  
  // not sure why this is a parameter but including it anyway
  course_id_suffix = "&ou=" + getCourseIdNumber();
  
  var link = prefix + 
             getCourseIdNumber() + "-" + 
             getCourseLabel() + "/" + 
             getFileName().replace(/ /g, "%20") + 
             cookie_suffix + 
             course_id_suffix;
  
  console.log("Generated link: " + link);
  
  return link; 
}

// Return name of file
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
  } else if (isHTML()) {
    ext = ".html";
  } else {
    ext = "";
  }
  return ext;
}

/*****************************************
 * TODO: Use regex instead of so many is...()
 *****************************************/

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
    if (txt[0].getAttribute("data-location").indexOf(".txt") != -1) {
      return true;
    } return false;
  }
  return false;
}

function isHTML() {
  var html = document.getElementsByClassName("d2l-fileviewer-text");
  if (html.length == 1) {
    if (html[0].getAttribute("data-location").indexOf(".html") != -1) {
      return true;
    } return false;
  }
  return false;
}

// Returns file name if it is a no preview file
// Returns null otherwise
function isNoPreviewFile() {
  var div = document.getElementsByClassName("d2l-textblock d2l-textblock-strong d2l-left")[0];
  if (div) {
    return div.innerText;
  } 
  if (determineExt() === "") {
    console.error("Could not get file name!");
  }
  return null;
}

// Returns the mycourses course id number
function getCourseIdNumber() {
  return url_path.split("/")[4];
}

// Returns the mycourses course label
function getCourseLabel() {
  var regex = /([A-Z]{4}\d{4,5}\.\d{4})/;
  var title = document.getElementsByTagName("body")[0].innerText;
  var label = regex.exec(title);
  console.log("Course Label: " + label);
  return label[0];
}