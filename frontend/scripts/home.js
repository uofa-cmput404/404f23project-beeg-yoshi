const createPostBtn = document.querySelector("[data-open-modal]")
const cancelPostBtn = document.querySelector("[data-close-modal]")
//const submitPostBtn = document.querySelector()
// const ORIGIN="https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/"
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
const username = 'beeg-yoshi';
const password = '12345';
const encodedCredentials = btoa(`${username}:${password}`);
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
            const response = await axios.get(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${userData.id}/friends/`, {
                headers: {
                    'Authorization': userData.token
                }
            });
            friendData=response.data;
        } catch (error) {
            console.log(error)
            
        }
    }
    getFriends();
    const getPosts = async () => { // A-Team
        try {
            const response = await axios.get(`https://c404-5f70eb0b3255.herokuapp.com/getAllPublicPosts/`)
            console.log(response.data.results.items);
            response.data.results.items.forEach(post => {
                const postDiv = document.createElement("div");
                postDiv.className = "post";
                const postPfp = document.createElement("img");
                postPfp.className = "postPfp";
                postPfp.src = "../images/mao.jpg";
                postPfp.alt = "Profile Picture";
                postDiv.appendChild(postPfp);
                const postTitle = document.createElement("div");
                postTitle.className = "postTitle";
                postTitle.textContent = post.title;
                postDiv.appendChild(postTitle);
                const postContent = document.createElement("div");
                postContent.className = "postContent";
                postContent.textContent = post.content; 
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
                    const likeCounter = document.createElement('span');
                    likeCounter.className = 'like-counter';
                    likeCounter.textContent = post.likes.length;
                    li.appendChild(likeCounter);
                    }
                    postNavList.appendChild(li);
                    li.addEventListener('click', function() {
                        switch(action) {
                            case "like":
                                console.log("like is clicked");
                        }
                        switch(action) {
                            case "comment":
                                console.log("comment is clicked");
                                console.log(post.author.id);
                                const postID=post.id.split("/")[6];
                                const getComments_ATeam = async () => { // A-Team
                                    try {
                                        const response = await axios.get(`https://c404-5f70eb0b3255.herokuapp.com/authors/${post.author.id}/posts/${postID}/comments/`);
                                        console.log(response.data);
                                        commentList.innerHTML = '';
                                        let commentsHtml = '';
                                        console.log(response.data.count);
                                        if (response.data.count === 0) {
                                            commentsHtml = '<p>No comments yet.</p>';
                                        }
                                        else{
                                        response.data.results.comments.forEach(comment => {
                                            const commentHtml = `
                                                <div class="comment-item">
                                                    <strong><i>${comment.author["displayName"]}</i> said:</strong>
                                                    <p>${comment.comment}</p>
                                                    <button class="like-btn" onclick="console.log('Like clicked for comment:', ${comment.id});">Like</button>
                                                </div>
                                            `;
                                            commentsHtml += commentHtml;
                                        });

                                    }
                                    commentList.innerHTML = commentsHtml;
                                    commentModal.style.display = "block";
                                    submitCommentBtn.onclick = () => {
                                        const createComment_ATeam = async () => {
                                            try {
                                                const data={
                                                    "author_id": userData.id,
                                                    "comment": userCommentInput.value,
                                                    "contentType": "text/plain"
                                                }
                                                const response = await axios.post(post.comments+"/",data, {
                                                    headers: {
                                                        'Authorization': "Token e99281997c1aad7dbc54e0c9b6414a9b3065339a"
                                                    
                                                    }
                                                })
                                                console.log(response.data);

                                            } catch (error) {
                                                console.log(error);
                                            }
                                        };
                                        createComment_ATeam();
                                        userCommentInput.value = '';
                                        commentModal.style.display = "none";

                                    };
                                    } catch (error) {
                                        console.log(error);
                                    }
                                }
                                getComments_ATeam();
                                break;
                            }
                            
                        switch(action) {
                            case "share":
                                console.log("share is clicked");
                            }
                        });
                });
                postNav.appendChild(postNavList);
                postContent.appendChild(postNavList);
                postDiv.appendChild(postContent);
                stream.appendChild(postDiv);
            });
            
        } catch (error) {
            console.log(error);
        }
        try {
            const response = await axios.get(`https://web-weavers-backend-fb4af7963149.herokuapp.com/public-posts/`,{
                headers: {
                    'Authorization': `Basic ${encodedCredentials}`
                }
            })
            console.log(response.data.items);
            response.data.items.forEach(post => {
                const postDiv = document.createElement("div");
                postDiv.className = "post";
                const postPfp = document.createElement("img");
                postPfp.className = "postPfp";
                postPfp.src = "../images/wusaqi.webp";
                postPfp.alt = "Profile Picture";
                postDiv.appendChild(postPfp);
                const postTitle = document.createElement("div");
                postTitle.className = "postTitle";
                postTitle.textContent = post.title;
                postDiv.appendChild(postTitle);
                const postContent = document.createElement("div");
                postContent.className = "postContent";
                postContent.textContent = post.content; 
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
                    postNavList.appendChild(li);
                    li.addEventListener('click', function() {
                        switch(action) {
                            case "like":
                                console.log("like is clicked");
                        }
                        switch(action) {
                            case "comment":
                                console.log("comment is clicked");
                            }
                        switch(action) {
                            case "share":
                                console.log("share is clicked");
                            }
                        });

                });
                postNav.appendChild(postNavList);
                postContent.appendChild(postNavList);
                postDiv.appendChild(postContent);
                stream.appendChild(postDiv);
            });
            
        } catch (error) {
            console.log(error);
        }
        try {
            const response = await axios.get(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/get/${userData.id}/posts/`);
            let images=[];
            try {
                const response = await axios.get(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/get/all/images/`);
                console.log(response.data);
                images=response.data;
            }
            catch(error){
                console.log(error);
            }
            console.log(response.data);
            response.data.forEach(post => {
                const postDiv = document.createElement("div");
                postDiv.className = "post";
                const postPfp = document.createElement("img");
                postPfp.className = "postPfp";
                postPfp.src = "../images/chiikawa.png";
                postPfp.alt = "Profile Picture";
                postDiv.appendChild(postPfp);
                const postTitle = document.createElement("div");
                postTitle.className = "postTitle";
                postTitle.textContent = post.title;
                postDiv.appendChild(postTitle);
                const postContent = document.createElement("div");
                postContent.className = "postContent";
                postContent.textContent = post.content;
                const imageDiv = document.createElement('div');
                images.forEach(image => {
                    if (image.post === post.id) {
                        const imageElement = document.createElement('img');
                        imageElement.className = 'image-on-post';
                        imageElement.style.width = '350px';
                        imageElement.style.margin = 'auto';
                        imageElement.style.marginTop = '30px';
                        imageElement.style.marginLeft = '30px';
                        imageElement.style.display = 'inline-block';
                        imageElement.style.maxHeight = '450px';
                        imageElement.src = `${image.image}`;
                        imageDiv.appendChild(imageElement);
                    }
                });
                postContent.appendChild(imageDiv);
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
                                const response = await axios.get(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${userData.id}/liked`)
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
                                const response = await axios.get(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${post.author}/posts/${post.id}/likes`)
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
                                        const response= await axios.post(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${userData.id}/like/${post.id}/`,data)
                                        console.log(response.data)
                                        window.location.reload();
                                        if (response.status === 200) {
                                            alert("You already liked this post.");
                                        }
                                    } catch (error) {
                                        console.log(error);
                                    }
                                }
                                likePost();
                                break;
                            case "comment":
                                console.log("comment is clicked");
                                const getComments = async () => {
                                    try {
                                        const response = await axios.get(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${post.author}/posts/${post.id}/comments`);
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
                                        const response= await axios.post(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${userData.id}/posts/${post.id}/comments`,data)
                                        console.log(response.data)
                                    } catch (error) {
                                        console.log(error);
                                        
                                    }
                                }
                                createComment();
                                userCommentInput.value = '';
                                commentModal.style.display = "none";
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
                                            const image_for_this_post = [];
                                            images.forEach(image => {
                                                if (image.post === post.id) {
                                                    image_for_this_post.push(image.image);
                                                }
                                            });
                                            const data = {
                                                senderId:userData.id,
                                                senderName:userData.displayName,
                                                postId:post.id,
                                                post:post.content,
                                                author:post.author,
                                                count:post.count,
                                                images:image_for_this_post,
                                            }
                                            try {
                                                const response = await axios.get(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${friendId}/inbox/`)
                                                const friendRequest=response.data.items["friendrequests"];
                                                const notifications=response.data.items["notifications"];
                                                const inbox = response.data.items["inbox"];
                                                inbox.push(data);
                                                const InboxData={"inbox":inbox,"notifications":notifications,"friendrequests":friendRequest}
                                                try {
                                                    const response = await axios.put(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${friendId}/inbox/`,InboxData)
                                                    console.log(response.data);
                                                    friendModal.style.display = "none";
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
                if (post.author.id === userData.id) {
                    const buttondiv = document.createElement("div");
                    buttondiv.className = "button-container";
                    const AddImageBtn = document.createElement("button");
                    AddImageBtn.textContent = "Add Image";
                    AddImageBtn.className = "add-image-btn";
                    buttondiv.appendChild(AddImageBtn);
                    AddImageBtn.addEventListener('click', () => {
                        const fileInput = document.createElement('input');
                        fileInput.type = 'file';
                        fileInput.accept = 'image/png, image/jpeg, image/webp, image/jpg';
                        fileInput.style.display = 'none';
                        const imagePreview = document.createElement('img');
                        imagePreview.style.display = 'none';
                        document.body.appendChild(imagePreview);
                        fileInput.addEventListener('change', function(event) {
                            const file = event.target.files[0];
                            if (file) {
                                console.log(file);
                                const reader = new FileReader();
                                reader.readAsDataURL(file);
                                reader.onload = function () {
                                    const base64Image = reader.result.split(',')[1];
                                    const data = {
                                        image: base64Image
                                    };
                                    const uploadImage = async () => {
                                        try {
                                            const response = await axios.post(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${userData.id}/posts/${post.id}/image`, data);
                                            console.log(response.data);
                                            window.location.reload();
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    };
                                    uploadImage();
                                  };
                                  reader.onerror = function (error) {
                                    console.log('Error: ', error);
                                  };
                            }
                        });
                        document.body.appendChild(fileInput);
                        fileInput.click();
                    });
                    const deleteBtn = document.createElement("button");
                    deleteBtn.textContent = "Delete";
                    deleteBtn.className = "delete-btn";
                    buttondiv.appendChild(deleteBtn);
                    deleteBtn.onclick = () => {
                        confirmationDialog.style.display = "block";
                        confirmDelete.onclick = () => {
                            const deletePost = async () => {
                                try{
                                const response= await axios.delete(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${userData.id}/posts/${post.id}`)
                                console.log(response.data)
                                window.location.reload();
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
                                const response= axios.put(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${userData.id}/posts/${post.id}`,data)
                                console.log(response.data)
                                window.location.reload();
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
            console.log(error);
            console.log(error);
        }
    }
    
    
    getPosts()

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
            description:description,
            content:content,
            contentType:contentType,
            categories:categories,
            visibility:visibility
        }
        try{
        const response= await axios.post(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${userData.id}/posts/`,data)
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
    getPosts();
})

Logout.addEventListener("click", () =>{
    localStorage.removeItem('userData');
    window.location.href="index.html"
})

closeModalBtn.addEventListener("click", () => {
    console.log("close comment modal.");
    commentModal.style.display = 'none';
});
friendModalCloseBtn.addEventListener('click', () => {
    friendModal.style.display = 'none';
});
//friends share