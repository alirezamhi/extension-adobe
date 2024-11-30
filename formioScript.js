(async function () {
    alert('ویدیو شما در حال دانلود هست پس از دانلود به صورت خودکار وارد پروژه میشود')
    let link = await getConfig('filePlay', [{
        key: '{relative}',
        value: data.SourceRelativePath
    }])
    function crateDataBaseVideo (address) {
        // خواندن فایل
        let dataBase = window.cep.fs.readFile(address, cep.encoding.UTF8);

        let dataFile = [];
        let videoMetaData = {
            name: data.Name,
            FileSize: data.FileSize,
            MetaId: data.MetaId,
            id: 0, // مقدار ID را بعداً تنظیم می‌کنیم
            Duration: data.Duration,
            link:window.location.href,
            status:'downloaded'
        };

        if (dataBase.err === 0 && dataBase.data) {
            try {
                // اگر فایل موجود و داده‌ها معتبر است
                dataFile = JSON.parse(dataBase.data);
            } catch (e) {
                // اگر فایل خالی یا داده نامعتبر است
                console.error("خطا در پارس کردن فایل JSON:", e);
                dataFile = [];
            }
        }

        // تنظیم ID جدید
        videoMetaData.id = dataFile.length;

        // اضافه کردن آبجکت جدید به آرایه
        dataFile.push(videoMetaData);

        // بازگرداندن داده‌های به‌روز‌شده
        return JSON.stringify(dataFile, null, 4);
    }



    function arrayBufferToBase64 (buffer) {
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
    await csInterface.evalScript('sendFileAddress()', async (saveAddress) => {
        saveAddress = saveAddress.replace(/\\/g, '/')
        const xhr = new XMLHttpRequest();
        let dataFile = crateDataBaseVideo(`${saveAddress}/database.json`)
        xhr.open("GET", link, true);
        xhr.responseType = "arraybuffer";

        xhr.onprogress = (event) => {
            // const percentage = (event.loaded / event.total) * 100;
            // const progressBar = document.getElementById("progress-bar");
            // const progressText = document.getElementById("progress-text");
            
            // if (percentage < 0) percentage = 0;
            // if (percentage > 100) percentage = 100;
          
            // progressBar.style.width = percentage + "%";
            // progressText.textContent = percentage + "%";
        };
        xhr.onload = function () {
            if (xhr.status === 200) {
                const fileData = xhr.response;
                const base64Data = arrayBufferToBase64(fileData);
                const fileName = `${data.Name}`
                const filePath = `${saveAddress}/${fileName}.mp4`;
                let result = window.cep.fs.writeFile(filePath, base64Data, cep.encoding.Base64);
                result = window.cep.fs.writeFile(`${saveAddress}/database.json`, dataFile, cep.encoding.UTF8)
                if (result.err == 0) {
                    csInterface.evalScript('importFile("' + filePath + '")');
                } else {
                    alert("error:" + result.err);
                }
            } else {
                alert("error download:" + xhr.status);
            }
        };

        xhr.onerror = function () {
            alert("network error");
        };

        xhr.send();

    });
})()


