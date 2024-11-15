(async function(){
    let link= await getConfig('filePlay', [{
    key: '{relative}',
    value: data.SourceRelativePath
  }])

  function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const chunkSize = 8192; 
    for (let i = 0; i < bytes.length; i += chunkSize) {
        const chunk = bytes.subarray(i, i + chunkSize);
        binary += String.fromCharCode.apply(null, chunk);
    }
    return btoa(binary);
    }
  var csInterface = new CSInterface();
  await csInterface.evalScript('sendFileAddress()', async (saveAddress)=>{
      saveAddress = saveAddress.replace(/\\/g, '/')
    const xhr = new XMLHttpRequest();
    xhr.open("GET", link, true);
    xhr.responseType = "arraybuffer";

    xhr.onload = function() {
        if (xhr.status === 200) {
            const fileData = xhr.response;
            const base64Data = arrayBufferToBase64(fileData);
            const fileName = `${data.Name}`
            const filePath = `${saveAddress}/${fileName}.mp4`;
            const result = window.cep.fs.writeFile(filePath, base64Data, cep.encoding.Base64);
            if (result.err == 0) {
                csInterface.evalScript('importFile("' + filePath + '")');
            } else {
                alert("error:"+ result.err);
            }
        } else {
            alert("error download:"+ xhr.status);
        }
    };

    xhr.onerror = function() {
        alert("network error");
    };

    xhr.send();

  });
})()


