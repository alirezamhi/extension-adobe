let importButton = document.querySelector('#importButton')
let BPMSButton = document.querySelector('#BPMSButton')
let welcomeMessage = document.querySelector('#welcomeMessage')
let videoManager = document.querySelector('#videoManager')
let welcomePage = document.querySelector('.welcome')
let tableList = document.querySelector('.tableList')
let table = document.querySelector('.table')
let modal = document.querySelector('#exampleModal')

var csInterface = new CSInterface();

BPMSButton.addEventListener('click', () => {
    // window.location.href = "http://localhost:8080/"
     window.location.href = "http://dev.nasim.int/bpms/app/tasklist/default/login"
    //  window.location.href = "http://dev.bazar.int/bpms/app/tasklist/default/?filter=0db46d81-7ddf-11ec-9687-005056a739eb&sorting=%5B%7B%22sortBy%22:%22created%22,%22sortOrder%22:%22desc%22%7D%5D&task=b2fbf440-b20d-11ef-b069-005056849e05"
})


modal.addEventListener('show.bs.modal', (e) => {
    let buttonId = e.relatedTarget.id
    let html
    let address = localStorage.getItem('importFile')
    switch (buttonId) {
        case 'setting':
            html = `
            <h3 class="mb-3">please set or edit setting</h3>
            <div class="input-group">
                <button class="btn btn-outline-secondary" id="importButton" type="button" onclick="selectFolder()">select Folder</button>
                <input type="text" class="form-control" id="importPath" placeholder="Folder..." disabled=true/>
                </div>
            `
            break;
        case 'playVideo':
            html = `
                <video src="${e.relatedTarget.dataset.address}" controls></video>
                `
            break;
    }
    modal.querySelector('.modal-body').innerHTML = html
    if (address) {
        let importPath = document.querySelector('#importPath')
        importPath.disabled = false
        importPath.value = address
        importPath.disabled = true
    }
})

async function createTabel (){
    let address = localStorage.getItem('importFile');
    let data = await window.cep.fs.readFile(`${address}/database.json`, cep.encoding.UTF8);

    if (data.err) {
        alert('Error reading the file:' + data.err);
        return;
    }

    let realedata;
    try {
        realedata = JSON.parse(data.data);
    } catch (e) {
        alert('Error parsing JSON:' + e);
        return;
    }
    welcomePage.classList.add('display-none');
    tableList.classList.remove('display-none');

    // پاک کردن محتوای قبلی جدول
    let isPrevTable = table.querySelector('tbody')
    if (isPrevTable) {
        table.removeChild(isPrevTable);
    }
    if (Array.isArray(realedata) && realedata.length) {
        let tbody = document.createElement('tbody');

        realedata.forEach((item) => {
            let tr = document.createElement('tr');
            let th = document.createElement('th');
            let td1 = document.createElement('td');
            let td2 = document.createElement('td');
            let td3 = document.createElement('td');
            let td4 = document.createElement('td');
            let td5 = document.createElement('td');
            let td6 = document.createElement('td');
            let td7 = document.createElement('td');

            th.textContent = item.id;
            td1.textContent = item.MetaId;
            td2.textContent = item.name;
            td3.textContent = item.FileSize;
            td4.textContent = item.Duration;
            td5.innerHTML = `<a href="${item.link}">click here</a>`
            td6.innerHTML = item.status
            td7.innerHTML = `
                <div class="btn-group btnStatus">
                    <button class='btn btn-secondary' data-address='${address}/${item.name}.mp4' onclick="addVideo(event)">add</button>    
                    <button class='btn btn-danger' data-name='${item.name}' onclick="deleteVideo(event)">delete</button>    
                    <button class='btn btn-success' data-bs-toggle="modal" data-bs-target="#exampleModal" id="playVideo" data-address='${address}/${item.name}.mp4'>play</button>
                </div>
            `

            tr.appendChild(th);
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tr.appendChild(td5);
            tr.appendChild(td6);
            tr.appendChild(td7);
    
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
    } else {
        alert('No data found.');
    }
}
videoManager.addEventListener('click', createTabel);

function backtowelcomPage () {
    welcomePage.classList.remove('display-none');
    tableList.classList.add('display-none');
}


function addVideo(e) {
    csInterface.evalScript('importFile("' +e.target.dataset.address+ '")')
}

function onloadData () {
    let text = ''
    csInterface.evalScript('getUserName()', (username) => {
        text += `welcome ${username}` + '\n'
        csInterface.evalScript('getVersionInfo()', (host) => {
            text += host
            welcomeMessage.textContent = text
        })
    })
    // let address = localStorage.getItem('importFile')
    // if(address){

    //     csInterface.evalScript('setFileAddress("' + address + '")',(e)=>{
    //         alert(e)
    //     })
    // }
}

// importButton.addEventListener('click', selectFolder)
// 
function selectFolder () {
    let importPath = document.querySelector('#importPath')
    csInterface.evalScript("selectFilePath()", (result) => {
        if (result !== '0') {
            importPath.disabled = false
            importPath.value = result
            importPath.disabled = true
        }
    });
}

function saveSetting () {
    csInterface.evalScript('sendFileAddress()', (address) => {
        if (address) {
            address = address.replace(/\\/g, '/')
            localStorage.setItem('importFile', address)
        }
    })
}

async function deleteVideo(e) {
    try {
        let address = localStorage.getItem('importFile');
        if (!address) throw new Error('Address not found in localStorage');

        // خواندن فایل
        let data = await window.cep.fs.readFile(`${address}/database.json`, cep.encoding.UTF8);
        if (!data.data) throw new Error('Failed to read data');

        data = JSON.parse(data.data);

        // فیلتر کردن آیتم‌ها
        let newItem = data.filter(item => item.name !== e.target.dataset.name);

        // نوشتن فایل جدید
        let writeResult = await window.cep.fs.writeFile(
            `${address}/database.json`,
            JSON.stringify(newItem, null, 2), // تبدیل داده‌ها به JSON با فرمت خوانا
            cep.encoding.UTF8
        );

        if (writeResult.err) throw new Error('Failed to write data');

        let filePath = `${address}/${e.target.dataset.name}.mp4`;
        let deleteResult = await window.cep.fs.deleteFile(filePath);

        if (deleteResult.err) throw new Error(`Failed to delete file: ${fileName}`);

        // به‌روزرسانی جدول
        createTabel();
    } catch (error) {
        console.error('Error in deleteVideo:', error.message);
    }
}

