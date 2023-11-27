document.addEventListener("DOMContentLoaded", function() {
    console.log("login here");
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
            const response = await axios.post("https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/login/",data)
            if (response.data.is_active === false && response.data.type === "AUTHOR"){
                alert("Your account is deactivated. Please contact admin to activate your account.")
                return
            }
            localStorage.setItem('userData', JSON.stringify(response.data));
            window.location.href="./Dashboard.html"
            
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
