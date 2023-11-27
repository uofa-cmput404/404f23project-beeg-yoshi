document.addEventListener("DOMContentLoaded", function() {
    const signupForm = document.querySelector("#signupForm");
    signupForm.addEventListener("submit", function(event) {
        event.preventDefault(); 
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;
        const displayName = document.querySelector("#displayName").value;
        const github = document.querySelector("#Github").value;
        const SignupAuthor = async ()=> {
            const data={
                email:email,
                password:password,
                displayName:displayName,
                github:github,
            }
            try{
                const response = await axios.post(`https://beeg-yoshi-social-distribution-50be4cf2bba8.herokuapp.com/service/create/author/`, data)
                window.location.href="./index.html"
                alert("Account Created Successfully")
        }
        catch(error){
            console.log(error)
        }
    }
    SignupAuthor()
    });
});
