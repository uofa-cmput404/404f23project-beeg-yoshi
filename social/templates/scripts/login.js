document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.querySelector("#loginForm");
    if(localStorage.getItem('userData')){
       localStorage.removeItem('userData');
    }
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault(); 
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;
        const login = async ()=> {
            const data={
                email:email,
                password:password
            }
            try{
            const response = await axios.post("http://127.0.0.1:8000/service/login/",data)
            console.log(response.data)
            localStorage.setItem('userData', JSON.stringify(response.data));
            window.location.href="index.html"
            
            }catch(error){
                alert("Invalid Credentials")
                console.log(error.response.data)
                console.log(error.response.status)
            }
            document.querySelector("#email").value=""
            document.querySelector("#password").value=""
        }
        login()
    });
});
