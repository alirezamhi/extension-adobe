function selectFilePath() {
  $.myFolder = Folder.selectDialog("Select a folder to Import video");
  if ($.myFolder) {
      return $.myFolder.fsName
  }else{
    return 0
  }
}

function sendFileAddress() {
  return $.myFolder.fsName
};

function importFile(pathAdress){
  alert(pathAdress)
  var filePaths = [pathAdress];
  var suppressUI = true;
  var targetBin = null;
  var importAsNumberedStills = false;
  
  var success = app.project.importFiles(filePaths, suppressUI, targetBin, importAsNumberedStills);
  
  if (success) {
      alert("File imported successfully!");
  } else {
      alert("Failed to import file.");
  }
  
}
