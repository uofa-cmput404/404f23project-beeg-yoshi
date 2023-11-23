const createPostBtn = document.querySelector("[data-open-modal]")
const cancelPostBtn = document.querySelector("[data-close-modal]")
//const submitPostBtn = document.querySelector()
// const ORIGIN="http://127.0.0.1:8000/"
const stream=document.querySelector(".stream")
const postModal = document.querySelector("[data-modal]")
const confirmationDialog = document.getElementById("confirmationDialog");
const confirmDelete = document.getElementById("confirmDelete");
const cancelDelete = document.getElementById("cancelDelete");
const editModal = document.getElementById("editModal");
const editPostContent = document.getElementById("editPostContent");
const saveChanges = document.getElementById("saveChanges");
const cancelEdit = document.getElementById("cancelEdit");
const closeModalBtn = document.querySelector(".close-btn");
const nav = document.querySelector(".navLinks")
const postButton = document.querySelector("#submitPostBtn")
const Logout = document.querySelector("#logoutBtn")
const commentModal = document.getElementById('commentModal');
const commentList = document.getElementById('commentList');
const userCommentInput = document.getElementById('userComment');
const submitCommentBtn = document.getElementById('submitCommentBtn');
const friendModal = document.querySelector('.friend-share-container');
const friendModalCloseBtn = document.querySelector(".friend-modal-close");
const friendList=document.querySelector(".list-items");
let friendData={};
document.addEventListener("DOMContentLoaded", function() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
        console.log(userData);
        if(userData.type==="SERVERADMIN"){
            let li = document.createElement("li");
            li.innerHTML = '<a href="./AdminPage.html">Manage Author Access</a>';
            nav.appendChild(li);
        }
    }
    const getFriends = async () => {
        try {
            const response=await axios.get(`http://127.0.0.1:8000/service/authors/${userData.id}/friends/`)
            friendData=response.data;
        } catch (error) {
            console.log(error)
            
        }
    }
    getFriends();
    const getPosts = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/service/authors/get/${userData.id}/posts/`);
            console.log(response.data);
            response.data.forEach(post => {
                const postDiv = document.createElement("div");
                postDiv.className = "post";
                const postPfp = document.createElement("img");
                postPfp.className = "postPfp";
                postPfp.src = "../images/beegYoshi.png";
                postPfp.alt = "Profile Picture";
                postDiv.appendChild(postPfp);
                const postContent = document.createElement("div");
                postContent.className = "postContent";
                postContent.textContent = post.content; 
                postDiv.appendChild(postContent);
                const postNav = document.createElement("div");
                postNav.className = "postNav";
                const postNavList = document.createElement("ul");
                ["like", "comment", "share"].forEach(action => {
                    const li = document.createElement("li");
                    li.className = `${action}-btn`;
                    const img = document.createElement("img");
                    img.src = `../images/${action}Icon.png`;
                    
                    img.id = `${action}Icon`;
                    img.alt = action;
                    li.appendChild(img);
                    if (action === "like") {
                        const checkIfLiked = async () => {
                            try {
                                const response = await axios.get(`http://127.0.0.1:8000/service/authors/${userData.id}/liked`)
                                console.log(response.data);
                                response.data.forEach(likedPost => {
                                    if (likedPost.object_id === post.id.toString()) {
                                        img.src = "../images/likedIcon.png";
                                    }
                                });
                            }catch(error){
                                console.log(error);
                            }
                        }
                        const likeCounter = document.createElement('span');
                        likeCounter.className = 'like-counter';
                        const getLikesForPost = async () => {
                            try {
                                const response = await axios.get(`http://127.0.0.1:8000/service/authors/${post.author}/posts/${post.id}/likes`)
                                console.log(response.data.length);
                                likeCounter.textContent = response.data.length;

                        }
                        catch(error){
                        }

                        li.appendChild(likeCounter);
                    }
                    checkIfLiked();
                    getLikesForPost();
                }
                    li.addEventListener('click', function() {
                        switch(action) {
                            case "like":
                                console.log("like is clicked");
                                const likePost = async () => {
                                    const data={
                                        author:userData.id,
                                        content_type:12,
                                        object_id:post.id
                                    }
                                    try {
                                        const response= await axios.post(`http://127.0.0.1:8000/service/authors/${userData.id}/like/${post.id}/`,data)
                                        console.log(response.data)
                                        if (response.status === 200) {
                                            alert("You already liked this post.");
                                        }
                                    } catch (error) {
                                        
                                    }
                                }
                                likePost();
                                break;
                            case "comment":
                                console.log("comment is clicked");
                                const getComments = async () => {
                                    try {
                                        const response = await axios.get(`http://127.0.0.1:8000/service/authors/${post.author}/posts/${post.id}/comments`);
                                        commentList.innerHTML = '';
                                        let commentsHtml = '';
                                        if (response.data.length === 0) {
                                            commentsHtml = '<p>No comments yet.</p>';
                                        }
                                        else{
                                        response.data.forEach(comment => {
                                            const commentHtml = `
                                                <div class="comment-item">
                                                    <strong><i>${comment.author["displayName"]}</i> said:</strong>
                                                    <p>${comment.comment}</p>
                                                    <button class="like-btn" onclick="console.log('Like clicked for comment:', ${comment.id});">Like</button>
                                                </div>
                                            `;
                                            if (post.visibility==="FRIENDS" ){
                                                if(comment.author.id===userData.id || post.author===userData.id){
                                                console.log("i comment or i am author")
                                                commentsHtml += commentHtml;
                                            }
                                            }
                                            else{
                                                console.log("it's public")
                                            commentsHtml += commentHtml;
                                            }
                                        });
                                    }
                                    if(commentsHtml==='' && post.visibility==="FRIENDS" ){
                                        commentsHtml = '<p>Comments on friend only post are only visible by post author and comment author</p>';
                                    }
                                        commentList.innerHTML = commentsHtml;
                                        
                                        commentModal.style.display = "block";
                                    } catch (error) {
                                        
                                    }
                                }
                                getComments();
                                submitCommentBtn.onclick = () => {
                                    const createComment = async () => {
                                        const data = {
                                            comment: userCommentInput.value,
                                            contentType:"text/markdown",
                                            post: post.id,
                                            author: userData.id
                                        };
    
                                    try {
                                        const response= await axios.post(`http://127.0.0.1:8000/service/authors/${userData.id}/posts/${post.id}/comments`,data)
                                        console.log(response.data)
                                    } catch (error) {
                                        console.log(error);
                                        
                                    }
                                }
                                createComment();
                                };
                                break;
                            case "share":
                                friendModal.style.display = "block";
                                friendList.innerHTML = '';
                                let friendsHtml = '';
                                friendData.forEach(friend => {
                                    const friendHtml = `
                                    <li class="item" data-user-id="${friend.id}">
                                    <span class="checkbox">
                                        <i class="fa-solid fa-check check-icon"></i>
                                    </span>
                                    <span class="item-text">${friend.displayName}</span>
                                </li>
                                    `;
                                    friendsHtml += friendHtml;
                                });
                                const submitbtnHTML = `
                                <button class="share-posts-btn"">Share</button>
                                `
                                friendsHtml += submitbtnHTML;
                                friendList.innerHTML = friendsHtml;
                                const items = document.querySelectorAll(".item");
                                items.forEach(item => {
                                    item.addEventListener("click", () => {
                                        item.classList.toggle("checked");
                                    });
                                })
                                document.querySelector(".share-posts-btn").addEventListener("click", () => {
                                    const selectedFriends = [];
                                    document.querySelectorAll(".item.checked").forEach(item => {
                                        selectedFriends.push(item.dataset.userId);
                                    });
                                    selectedFriends.forEach(friendId => {
                                        const sharePost = async () => {
                                            const data = {
                                                senderId:userData.id,
                                                senderName:userData.displayName,
                                                postId:post.id,
                                                post:post.content,
                                                author:post.author,
                                                count:post.count,
                                            }
                                            try {
                                                const response = await axios.get(`http://127.0.0.1:8000/service/authors/${friendId}/inbox/`)
                                                const friendRequest=response.data.items["friendrequests"];
                                                const notifications=response.data.items["notifications"];
                                                const inbox = response.data.items["inbox"];
                                                inbox.push(data);
                                                const InboxData={"inbox":inbox,"notifications":notifications,"friendrequests":friendRequest}
                                                try {
                                                    const response = await axios.put(`http://127.0.0.1:8000/service/authors/${friendId}/inbox/`,InboxData)
                                                    console.log(response.data);
                                                } catch (error) {
                                                    console.log(error);
                                                }
                                            } catch (error) {
                                                console.log(error);
                                            }
                                        }
                                        sharePost();
                                    })
                                });
                                break;
                        }
                    });
                    postNavList.appendChild(li);
                });
                postNav.appendChild(postNavList);
                postContent.appendChild(postNavList);
                if (post.author === userData.id) {
                    const buttondiv = document.createElement("div");
                    buttondiv.className = "button-container";
                    const deleteBtn = document.createElement("button");
                    deleteBtn.textContent = "Delete";
                    deleteBtn.className = "delete-btn";
                    buttondiv.appendChild(deleteBtn);
                    deleteBtn.onclick = () => {
                        confirmationDialog.style.display = "block";
                        confirmDelete.onclick = () => {
                            const deletePost = async () => {
                                try{
                                const response= await axios.delete(`http://127.0.0.1:8000/service/authors/${userData.id}/posts/${post.id}`)
                                console.log(response.data)
                                }
                                catch(error){
                                    console.log(error.response.data)
                                    console.log(error.response.status)
                                }
                            };
                            deletePost();
                        };
                        cancelDelete.onclick = () => {
                            confirmationDialog.style.display = "none";
                        };
                    };
                    const editBtn = document.createElement("button");
                    editBtn.textContent = "Edit";
                    editBtn.className = "edit-btn";
                    buttondiv.appendChild(editBtn);
                    editBtn.onclick = (event) => {
                        event.stopPropagation();
                        editPostContent.value = post.content;
                        editModal.style.display = "block";
                        saveChanges.onclick = () => {    
                            post.content = editPostContent.value;
                            const data={
                                content:post.content
                            }
                            try {
                                const response= axios.put(`http://127.0.0.1:8000/service/authors/${userData.id}/posts/${post.id}`,data)
                                console.log(response.data)
                            } catch (error) {
                                console.log(error.response.data);
                                console.log(error.response.status); 
                            }
                            editModal.style.display = "none";
                        };
                    
                        cancelEdit.onclick = () => {
                            editModal.style.display = "none";
                        };
                    };
                    postNavList.appendChild(buttondiv);
                }
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
    const visibility=document.querySelector("#visibility").value;
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
            visibility:visibility
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
    document.querySelector("#postTitle").value="";
    document.querySelector("#postDescription").value="";
    document.querySelector("#postContent").value="";
    document.querySelector("#content-type").value="";
    document.querySelector("#categories").value="";
    document.querySelector("#visibility").value="";

})

Logout.addEventListener("click", () =>{
    localStorage.removeItem('userData');
    window.location.href="loginPage.html"
})

closeModalBtn.addEventListener("click", () => {
    console.log("close comment modal.");
    commentModal.style.display = 'none';
});
friendModalCloseBtn.addEventListener('click', () => {
    friendModal.style.display = 'none';
});
//friends share