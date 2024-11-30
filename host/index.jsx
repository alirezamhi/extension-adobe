#include "json2.js";
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
  var filePaths = [pathAdress];
  var suppressUI = true;
  var targetBin = null;
  var importAsNumberedStills = false;
  
  var success = app.project.importFiles(filePaths, suppressUI, targetBin, importAsNumberedStills);
  if (!success) {
    alert("Failed to import file.");
  } 
  
}

function getVersionInfo() {
  return 'PPro ' + app.version + 'x' + app.build;
}

function getUserName() {
  var userName	= "User name not found.";
  var homeDir		= new File('~/');
  if (homeDir) {
      userName = homeDir.displayName;
      homeDir.close();
  }
  return userName;
}


function setFileAddress(address) {
  $.myFolder = {fsName:address}
}

function createSequence() {
  var activeSequence = app.project.activeSequence;
  var sequence
  if (!activeSequence) {
   var idSequence = 'fd763a6c-67f0-464a-ab02-24c60f625a3f'
     sequence = app.project.createNewSequence("samimGroup", idSequence);
    if (sequence == 0) {
      alert("Not created! There was an error.");
    }
  } else {
    sequence = app.project.sequences[0]
  }
  return sequence
}

function createMarks(data) {
  var ArrData = JSON.parse(data)
  var activeSequence = app.project.activeSequence;
  var sequence
  if (!activeSequence) {
   var idSequence = 'fd763a6c-67f0-464a-ab02-24c60f625a3f'
     sequence = app.project.createNewSequence("samimGroup", idSequence);
    if (sequence == 0) {
      alert("Not created! There was an error.");
    }
  } else {
    sequence = app.project.sequences[0]
  }
  var markers = sequence.markers;
  if (markers){
    for (var i = 0; i < ArrData.length; i++) {
      var newCommentMarker = markers.createMarker(ArrData[i].start);
      newCommentMarker.name = ArrData[i].content
      newCommentMarker.comments = "Comments"
      newCommentMarker.end = (ArrData[i].end);
      newCommentMarker.setColorByIndex(i);
    }
  } 
}

function processSequences(sequenceData) {
  var sequences = eval(sequenceData);
  for (var i = 0; i < sequences.length; i++) {
      $.writeln('Sequence Name: ' + sequences[i]);
  }
}




