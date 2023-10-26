const createPostBtn = document.querySelector("[data-open-modal]")
const cancelPostBtn = document.querySelector("[data-close-modal]")
//const submitPostBtn = document.querySelector()
const postModal = document.querySelector("[data-modal]")

createPostBtn.addEventListener("click", () =>{
    postModal.showModal()
})

cancelPostBtn.addEventListener("click", () =>{
    console.log('click')
    postModal.close()
})
