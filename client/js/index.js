
let importButton = document.querySelector('#importButton')
let importPath = document.querySelector('#importPath')
let errorItem = document.querySelector('#error')
let samimButton = document.querySelector('.samimButton')
// let importbutton = document.querySelector('.import')

var csInterface = new CSInterface();

importButton.addEventListener('click',selectFolder)
samimButton.addEventListener('click',()=>{
    window.location.href = "http://dev.bazar.int/bpms/app/database/default/form-edit/TestAdobePremierEpgFileViewIndexFrom?tab=info"
})
// importbutton.addEventListener('click',()=>{
//     csInterface.evalScript("importFile()")
// })

function selectFolder(){
    csInterface.evalScript("selectFilePath()",(result)=>{
        importPath.textContent = result
    });
}

