
let importButton = document.querySelector('#importButton')
let importPath = document.querySelector('#importPath')
let errorItem = document.querySelector('#error')
let samimButton = document.querySelector('#samimButton')
let errorText = document.querySelector('.invalid-feedback')

var csInterface = new CSInterface();

importButton.addEventListener('click',selectFolder)
samimButton.addEventListener('click',()=>{
    window.location.href = "http://dev.bazar.int/bpms/app/database/default/form-edit/TestAdobePremierEpgFileViewIndexFrom?tab=info"
})

function selectFolder(){
    csInterface.evalScript("selectFilePath()",(result)=>{
        if(result !== '0'){
            importPath.disabled = false
            importPath.value = result
            importPath.disabled = true
            samimButton.disabled = false
            errorText.classList.remove("display");
        }else{
            samimButton.disabled = true
            errorText.classList.add("display");
        }
    });
}

