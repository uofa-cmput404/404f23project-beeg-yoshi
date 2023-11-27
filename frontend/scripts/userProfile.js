const editModal = document.querySelector("[data-modal]")
const nav = document.querySelector(".navLinks")
const editProfileBtn = document.querySelector("#edit-profile-btn")
const exitEditBtn = document.querySelector("[data-close-modal]")
const confirmEditBtn = document.querySelector("#confirmEditBtn")
const Name=document.querySelector("#handle")
const bio=document.querySelector("#bio")
const userData = JSON.parse(localStorage.getItem('userData'));
if (userData) {
    console.log(userData)
    if(userData.type==="SERVERADMIN"){
        let li = document.createElement("li");
        li.innerHTML = '<a href="./AdminPage.html">Manage Author Access</a>';
        nav.appendChild(li);
    }
}
document.querySelector("#userHandle").value=userData.displayName
document.querySelector("#userGithub").value=userData.github
document.querySelector("#userEmail").value=userData.email
document.querySelector("#editBio").value=userData.biography
Name.innerHTML=userData.displayName
bio.innerHTML=userData.biography
editProfileBtn.addEventListener("click", () =>{
    editModal.show()
})

exitEditBtn.addEventListener("click", () =>{
    editModal.close()
})

confirmEditBtn.addEventListener("click", async () => {
    console.log("Submit the changes here")
        const data={
            displayName:document.querySelector("#userHandle").value,
            biography:document.querySelector("#editBio").value,
            github:document.querySelector("#userGithub").value,
            email:document.querySelector("#userEmail").value,
        }
        if (document.querySelector("#userPasswordNew").value !== ""){
            data.password=document.querySelector("#userPasswordNew").value
        }
        
        console.log(data)
        try {
            const response= await axios.post(`https://beeg-yoshi-social-distribution-50be4cf2bba8.herokuapp.com/service/authors/${userData.id}/`, data)
            console.log(response.data)
            userData.displayName = data.displayName;
            userData.biography = data.biography;
            localStorage.setItem('userData', JSON.stringify(userData));
            Name.textContent = userData.displayName;
            bio.textContent = userData.biography;
        } catch (error) {
            console.log(error);
        }
        editModal.close()
});