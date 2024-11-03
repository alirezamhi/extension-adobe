
const csInterface = new CSInterface();
const logginPage = document.querySelector('#loggin')
const tablePage = document.querySelector('#table')
let logginHtml = `
		    <h2>Login</h2>
        <input type="text" id="userName" placeholder="نام کاربری">
        <input type="text" id="password" placeholder="رمز عبور">
        <button onclick="login()">Login</button>	
        `

function loadPage () {
  fetch("http://qc.bazar.int/bpms", { method: "POST" })
    .then(response => {
      
      const xsrfToken = response.headers.get("X-XSRF-TOKEN");
      localStorage.setItem('firstToken', xsrfToken)
    })
    .catch(error => console.error("Error:", error));
  logginPage.innerHTML = logginHtml
}
function login () {
  let userName = logginPage.querySelector('#userName').value
  let password = logginPage.querySelector('#password').value
  const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
myHeaders.append("X-XSRF-TOKEN", "16172D06200466D72140A576E2F57668");
myHeaders.append("Accept", "application/json, text/plain, */*");

const raw = "username=ahosseini&password=Aa@1234567";

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("http://qc.bazar.int/bpms/api/admin/auth/user/default/login/tasklist", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  // .catch((error) => console.error(error));
}




