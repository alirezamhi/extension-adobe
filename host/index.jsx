#include "json2.js";
function selectFilePath () {
  $.myFolder = Folder.selectDialog("Select a folder to Import video");
  if ($.myFolder) {
    return $.myFolder.fsName
  } else {
    return 0
  }
}

function sendFileAddress () {
  return $.myFolder.fsName
};

function importFile (pathAdress) {
  var filePaths = [pathAdress];
  var suppressUI = true;
  var targetBin = null;
  var importAsNumberedStills = false;

  var success = app.project.importFiles(filePaths, suppressUI, targetBin, importAsNumberedStills);
  if (success) {
    var importedItem = app.project.rootItem.children[app.project.rootItem.children.numItems - 1];  // آخرین آیتم واردشده
    $.writeln(importedItem)
    // پیدا کردن Sequence مدنظر
    var targetSequence = null;
    for (var i = 0; i < app.project.sequences.numSequences; i++) {
      if (app.project.sequences[i].name === 'SamimTaskList') {
        targetSequence = app.project.sequences[i];
        break;
      }
    }
    $.writeln(targetSequence, 'mayyyyyyyyyyyyyyyyyy seqqqqqqqqqqqqq')
    if (targetSequence && importedItem) {
      // اضافه کردن فایل به Sequence هدف
      targetSequence.videoTracks[0].insertClip(importedItem, targetSequence.getInPoint());
      alert("فایل با موفقیت به Sequence اضافه شد!");
    } else {
      alert("Sequence یا فایل پیدا نشد.");
    }
  }

}

function getVersionInfo () {
  return 'PPro ' + app.version + 'x' + app.build;
}

function getUserName () {
  var userName = "User name not found.";
  var homeDir = new File('~/');
  if (homeDir) {
    userName = homeDir.displayName;
    homeDir.close();
  }
  return userName;
}

function getActiveSequence (id) {
  $.writeln('al')
  var result
  $.nameSequence = id
  var project = app.project; // Access the current project
  var sequences = project.sequences; // Get all sequences in the project
  if (sequences.numSequences > 0) {
    for (var i = 0; i < sequences.numSequences; i++) {
      var seq = sequences[i]; // Access each sequence
      if (seq.name == id) {
        $.writeln("Sequence " + (i + 1) + ": " + seq.name);
        $.haveSequence = seq
        result = true
      } else {
        result = false
      }
    }
  } else {
    $.writeln("No sequences found in this project.");
    result = false
  }
  $.writeln(result)
  return result
}

function addTags (JsonData) {
  var data = JSON.parse(JsonData)
  if ($.haveSequence) {
    var lastMarkers = $.haveSequence.projectItem.getMarkers();
    if (lastMarkers) {
      while (lastMarkers.numMarkers > 0) {
        var myMarkers = lastMarkers.getFirstMarker()
        lastMarkers.deleteMarker(myMarkers);
      }
    }
    var markers = $.haveSequence.markers;
    if (markers) {
      for (var i = 0; i < data.length; i++) {
        var newCommentMarker = markers.createMarker(data[i].start);
        newCommentMarker.name = data[i].content
        newCommentMarker.comments = "Comments"
        newCommentMarker.end = (data[i].end);
        newCommentMarker.setColorByIndex(i);
      }
    }
  } else {
    var uniqIdSequence = 'fd763a6c-67f0-464a-ab02-24c60f625a3f'
    sequence = app.project.createNewSequence($.nameSequence, uniqIdSequence);
    if (sequence) {
      var markers = sequence.markers;
      if (markers) {
        for (var i = 0; i < data.length; i++) {
          var newCommentMarker = markers.createMarker(data[i].start);
          newCommentMarker.name = data[i].content
          newCommentMarker.comments = "Comments"
          newCommentMarker.end = (data[i].end);
          newCommentMarker.setColorByIndex(i);
        }
      }
    }
    if (sequence == 0) {
      alert("Not created! There was an error.");
    }
  }
}

function addFile () {
  // if (importSuccess) {
  //     var importedItem = app.project.rootItem.children[app.project.rootItem.children.numItems - 1];  // آخرین آیتم واردشده

  //     // پیدا کردن Sequence مدنظر
  //     var targetSequence = null;
  //     for (var i = 0; i < app.project.sequences.numSequences; i++) {
  //         if (app.project.sequences[i].name === sequenceName) {
  //             targetSequence = app.project.sequences[i];
  //             break;
  //         }
  //     }

  //     if (targetSequence && importedItem) {
  //         // اضافه کردن فایل به Sequence هدف
  //         targetSequence.videoTracks[0].insertClip(importedItem, targetSequence.getInPoint());
  //         alert("فایل با موفقیت به Sequence اضافه شد!");
  //     } else {
  //         alert("Sequence یا فایل پیدا نشد.");
  //     }
  // } else {
  //     alert("وارد کردن فایل موفق نبود.");
  // }


}

function setFileAddress (address) {
  $.myFolder = { fsName: address }
}

function createSequence () {
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

function createMarks (data) {
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
  if (markers) {
    for (var i = 0; i < ArrData.length; i++) {
      var newCommentMarker = markers.createMarker(ArrData[i].start);
      newCommentMarker.name = ArrData[i].content
      newCommentMarker.comments = "Comments"
      newCommentMarker.type = ArrData[i].type
      newCommentMarker.end = (ArrData[i].end);
      newCommentMarker.setColorByIndex(i);
    }
  }
}

function processSequences (sequenceData) {
  var sequences = eval(sequenceData);
  for (var i = 0; i < sequences.length; i++) {
    $.writeln('Sequence Name: ' + sequences[i]);
  }
}

function getAllMarkersFromSequence() {
  var seq = app.project.activeSequence;  // گرفتن سکانس فعال
  if (seq) {
      var markers = seq.markers;  // استفاده از markers از سکانس
      var markerArray = [];

      // حلقه برای دریافت همه Markerها
      for (var i = 0; i < markers.numMarkers; i++) {
          var marker = markers[i];  // هر Marker را به ترتیب دریافت می‌کنیم
          var obj = {
            content: marker.name,  // نام Marker
            comment: marker.comments,  // توضیحات Marker
            group: 'cut',  // توضیحات Marker
            start: marker.start.ticks / 254016000,  // زمان شروع به ثانیه
            end: marker.type == 'range'? marker.end.ticks / 254016000 : '', // مدت زمان Marker به ثانی
            type: marker.type
        }
          markerArray.push(obj)
      }

      if (markerArray.length > 0) {
          return JSON.stringify(markerArray);  // برگرداندن Markerها به صورت JSON
      } else {
          alert("هیچ Markerای وجود ندارد.");
      }
  } else {
      alert("هیچ سکانسی فعال نیست.");
  }
}





