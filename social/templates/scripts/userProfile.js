const editModal = document.querySelector("[data-modal]")

const editProfileBtn = document.querySelector("#edit-profile-btn")
const exitEditBtn = document.querySelector("[data-close-modal]")
const confirmEditBtn = document.querySelector("#confirmEditBtn")

editProfileBtn.addEventListener("click", () =>{
    editModal.show()
})

exitEditBtn.addEventListener("click", () =>{
    editModal.close()
})

confirmEditBtn.addEventListener("click", () => {
    console.log("Submit the changes here")
    editModal.close()
})