const createPostBtn = document.querySelector("[data-open-modal]")
const cancelPostBtn = document.querySelector("[data-close-modal]")
//const submitPostBtn = document.querySelector()
// const ORIGIN="http://127.0.0.1:8000/"
const stream=document.querySelector(".stream")
const postModal = document.querySelector("[data-modal]")
const nav = document.querySelector(".navLinks")
const postButton = document.querySelector("#submitPostBtn")
const Logout = document.querySelector(".log-out")
document.addEventListener("DOMContentLoaded", function() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        console.log(userData);
        if(userData.type==="SERVERADMIN"){
            let li = document.createElement("li");
            li.innerHTML = '<a href="">Manage Author Access</a>';
            nav.appendChild(li);
        }
    }
    const getPosts = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/service/test/posts");
            console.log(response.data);
            response.data.forEach(post => {
                const postDiv = document.createElement("div");
                postDiv.className = "post";
                const postPfp = document.createElement("div");
                postPfp.className = "postPfp";
                postPfp.textContent = "PFP"; 
                postDiv.appendChild(postPfp);
                const postContent = document.createElement("div");
                postContent.className = "postContent";
                postContent.textContent = post.content; 
                postDiv.appendChild(postContent);
                const postNav = document.createElement("div");
                postNav.className = "postNav";
                const postNavList = document.createElement("ul");
                const likeLi = document.createElement("li");
                likeLi.textContent = "Like";
                postNavList.appendChild(likeLi);
                const commentLi = document.createElement("li");
                commentLi.textContent = "Comment";
                postNavList.appendChild(commentLi);
                const shareLi = document.createElement("li");
                shareLi.textContent = "Share";
                postNavList.appendChild(shareLi);
                postNav.appendChild(postNavList);
                postDiv.appendChild(postNav);
                stream.appendChild(postDiv);
            });
    
        } catch (error) {
            console.log(error.response.data);
            console.log(error.response.status);
        }
    }
    
    getPosts()

});

createPostBtn.addEventListener("click", () =>{
    postModal.showModal()
})

cancelPostBtn.addEventListener("click", () =>{
    postModal.close()
})
postButton.addEventListener("click", () =>{
    const userData = JSON.parse(localStorage.getItem('userData'));
    const title = document.querySelector("#postTitle").value;
    const description = document.querySelector("#postDescription").value;
    const content = document.querySelector("#postContent").value;
    const contentType=document.querySelector("#content-type").value;
    const categoriesElement = document.querySelector("#categories");
    const selectedOptions = Array.from(categoriesElement.selectedOptions);
    const categories = selectedOptions.map(option => option.value);
    const createPost = async ()=> {
        const data={
            title:title,
            source:"test source",
            origin:"test origin1",
            description:description,
            content:content,
            contentType:contentType,
            categories:categories,
        }
        try{
        const response= await axios.post(`http://127.0.0.1:8000/service/authors/${userData.id}/posts/`,data)
        console.log(response.data)
        postModal.close()
        }
        catch(error){
            console.log(error.response.data)
            console.log(error.response.status)
        }
    }
    createPost()
})
Logout.addEventListener("click", () =>{
    localStorage.removeItem('userData');
    window.location.href="loginPage.html"
})