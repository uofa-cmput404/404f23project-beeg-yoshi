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
const postContentTextarea = document.querySelector("#postContent");
const imagePreviewContainer = document.getElementById("imagePreviewContainer");
const imagePreview = document.getElementById("imagePreview");
const contentTypeSelect = document.querySelector("#content-type");
const imageInputContainer = document.querySelector("#imageInputContainer");
contentTypeSelect.addEventListener('change', function() {
    if (this.value === 'image') {
        postContentTextarea.style.display = 'none';
        imageInputContainer.style.display = 'block';
        imagePreviewContainer.style.display = 'block';
    } else {
        postContentTextarea.style.display = 'block';
        imageInputContainer.style.display = 'none';
        imagePreviewContainer.style.display = 'none';
        imagePreview.style.display = 'none';
    }
});
let friendData={};
let people={"A-Team":[],"Web Weavers":[]};
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
    const getPeople = async () => {
        let A_Team_res= await axios.get(`https://c404-5f70eb0b3255.herokuapp.com/authors/`)
        let web_weavers_res= await axios.get(`https://web-weavers-backend-fb4af7963149.herokuapp.com/authors/`, {
            headers: {
                'Authorization': `Basic ${encodedCredentials}`
            }
        })
        people["A-Team"]=A_Team_res.data.results.items;
        people["Web Weavers"]=web_weavers_res.data.items;
        console.log(people);
    }
    const getFriends = async () => {
        try {
            const response = await axios.get(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${userData.id}/friends/`, {
                headers: {
                    'Authorization': userData.token
                }
            });
            try {
                const response1 = await axios.get(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/remote/authors/${userData.id}/friends/`)
                friendData=response.data.concat(response1.data);
                await getPeople();
                friendData.forEach(friend => {
                    console.log(friend.server==='A-Team');
                    if(friend.server==='A-Team'){
                        people["A-Team"].forEach(person => {
                            if(person.id===friend.to_user){
                                friend.displayName=person.displayName;
                            }
                        });
                    }
                    if (friend.server==='Web Weavers') {
                        people["Web Weavers"].forEach(person => {
                            if(person.uuid===friend.to_user){
                                friend.displayName=person.displayName;
                            }
                        });
                    }
                });
                console.log(friendData);
            } catch (error) {
                console.log(error);
            }
            
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
                if (post.content.length > 5000) {
                    console.log('Post content too long, skipping post.');
                    return;
                }
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
                    postNavList.appendChild(li);
                    const checkIfLikedA_Team = () => {
                        console.log("check if liked running")
                        if (action === "like") {
                            console.log("action is like")
                            let likeCounter = li.querySelector('.like-counter');
                            if (!likeCounter) {
                                likeCounter = document.createElement('span');
                                likeCounter.className = 'like-counter';
                                li.appendChild(likeCounter);
                            }
                            likeCounter.textContent = post.likes.length;
                        post.likes.forEach(likedPost => {
                            if (likedPost.author.id === userData.id.toString()) {
                                console.log("liked by me")
                                img.src = "../images/likedIcon.png";
                            }
                        });
                    }
                    }
                    checkIfLikedA_Team();
                    li.addEventListener('click', function() {
                        switch(action) {
                            case "like":
                                console.log("like is clicked");
                                const likePost_ATeam = async () => {
                                    let liked = false;
                                    post.likes.forEach(likedPost => {
                                        if (likedPost.author.id === userData.id.toString()) {
                                            liked = true;
                                        }
                                    });
                                    console.log(liked);
                                    if(liked){
                                        alert("You already liked this post.");
                                        return;
                                    }
                                        try {
                                            const data={
                                                "author_id": userData.id,
                                            }
                                            const postID=post.id.split("/")[6];
                                            const response= await axios.post(`https://c404-5f70eb0b3255.herokuapp.com/authors/${post.author.id}/posts/${postID}/likes/`,data, {
                                                headers: {
                                                    'Authorization': "Token e99281997c1aad7dbc54e0c9b6414a9b3065339a"
                                                }
                                            })
                                            console.log(response.data)
                                            window.location.reload();
                                        } catch (error) {
                                            console.log(error);
                                        }

                                }
                                likePost_ATeam();
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
        try { //Web weavers
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
                    const checkLike_web_weavers=async()=>{
                    if (action === "like") {
                        const checkIfLiked = async () => {
                            try {
                                const postID=post.id.split("/")[6];
                                const response = await axios.get(`https://web-weavers-backend-fb4af7963149.herokuapp.com/authors/${post.author.uuid}/posts/${postID}/likes/`, {
                                    headers: {
                                        'Authorization': `Basic ${encodedCredentials}`
                                    }
                                })

                                let likeCounter = li.querySelector('.like-counter');
                                if (!likeCounter) {
                                likeCounter = document.createElement('span');
                                likeCounter.className = 'like-counter';
                                li.appendChild(likeCounter);
                                }
                                likeCounter.textContent = response.data.items.length;
                                response.data.items.forEach(likedPost => {
                                    console.log(likedPost.author.id +"/"=== userData.url);
                                    if (likedPost.author.id +"/"=== userData.url) {
                                        img.src = "../images/likedIcon.png";
                                        return true;
                                    }
                                });
                                return false;
                            } catch (error) {
                                console.log(error);
                            }
                        }
                        checkIfLiked();
                    }
                }
                checkLike_web_weavers();
                    li.addEventListener('click', function() {
                        switch(action) {
                            case "like":
                                console.log("like is clicked");
                                const likePost_Web_Weavers = async () => {
                                    let liked = false;
                                    const checkBeforeLike=async()=>{
                                    liked= await checkLike_web_weavers();
                                    }
                                    checkBeforeLike();
                                    console.log(liked);
                                    if(liked){
                                        alert("You already liked this post.");
                                        return;
                                    }
                                        try {
                                            const data={
                                                author:userData.url,
                                                type : "Like",
                                                object: post.id,
                                                summary:"" + userData.displayName + " liked your post"
                                            }
                                            const response= await axios.post(`https://web-weavers-backend-fb4af7963149.herokuapp.com/authors/${post.author.uuid}/inbox/`,data, {
                                                headers: {
                                                    'Authorization': `Basic ${encodedCredentials}`
                                                }
                                                })
                                            console.log(response.data)
                                            checkLike_web_weavers();
                                        } catch (error) {
                                            console.log(error);
                                            
                                        }

                                }
                                likePost_Web_Weavers();
                        }
                        switch(action) {
                            case "comment":
                                console.log("comment is clicked");
                                const getComments_Web_Weavers = async () => {
                                    try {
                                        const postID=post.id.split("/")[6];
                                        const response = await axios.get(`https://web-weavers-backend-fb4af7963149.herokuapp.com/authors/${post.author.uuid}/posts/${postID}/comments/`, {
                                            headers: {
                                                'Authorization': `Basic ${encodedCredentials}`
                                            }
                                        });
                                        console.log(response.data);
                                        commentList.innerHTML = '';
                                        let commentsHtml = '';
                                        if (response.data.items.length === 0) {
                                            commentsHtml = '<p>No comments yet.</p>';
                                        }
                                        else{
                                        response.data.items.forEach(comment => {
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
                                    } catch (error) {
                                        console.log(error);
                                    }
                                }
                                getComments_Web_Weavers();
                                submitCommentBtn.onclick = () => {
                                    const createComment_Web_Weavers = async () => {
                                        try {
                                            let urlSend=String(userData.url)
                                            urlSend=urlSend.slice(0,-1)
                                            const data={
                                                author:urlSend,
                                                comment:userCommentInput.value,
                                                contentType:"text/plain"
                                            }
                                            const postID=post.id.split("/")[6];
                                            const response = await axios.post(`https://web-weavers-backend-fb4af7963149.herokuapp.com/authors/${post.author.uuid}/posts/${postID}/comments/`,data, {
                                                headers: {
                                                    'Authorization': `Basic ${encodedCredentials}`
                                                }
                                            })
                                            const comment_id=response.data.id;
                                            try {
                                                const data1={
                                                    id:comment_id,
                                                    type: "comment",
                                                }
                                                const response1= await axios.post(`https://web-weavers-backend-fb4af7963149.herokuapp.com/authors/${post.author.uuid}/inbox/` ,data1, {
                                                    headers: {
                                                        'Authorization': `Basic ${encodedCredentials}`
                                                    }
                                                 } )
                                            } catch (error) {
                                                console.log(error);
                                            }
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    }
                                    createComment_Web_Weavers();
                                    userCommentInput.value = '';
                                    commentModal.style.display = "none";
                                };

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
        try { //beeg-yoshi
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
                        imageElement.style.maxHeight = '400px';
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
                    const checkLike=async()=>{
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
                        let likeCounter = li.querySelector('.like-counter');
                        if (!likeCounter) {
                            likeCounter = document.createElement('span');
                            likeCounter.className = 'like-counter';
                            li.appendChild(likeCounter);
                        }
                        const getLikesForPost = async () => {
                            try {
                                const response = await axios.get(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${post.author}/posts/${post.id}/likes`)
                                console.log(response.data.length);
                                likeCounter.textContent = response.data.length;

                        }
                        catch(error){
                            console.log(error);
                        }

                        li.appendChild(likeCounter);
                    }
                    checkIfLiked();
                    getLikesForPost();
                }
            }
            checkLike("first");
                    li.addEventListener('click', function() {
                        switch(action) {
                            case "like":
                                console.log("like is clicked");
                                const likePost = async () => {
                                    const data={
                                        author:userData.id,
                                        object_id:post.id
                                    }
                                    try {
                                        const response= await axios.post(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${userData.id}/like/${post.id}/`,data)
                                        console.log(response.data)
                                        checkLike("second");
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
                                                    <strong><i>${comment.author["displayName"]?comment.author["displayName"]:comment.displayName}</i> said:</strong>
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
                                        console.log(error);
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
                                    console.log(friend);
                                    const serverName = friend.host === "https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/" ? "Beeg Yoshi" : friend.server;
                                    const friendHtml = `
                                    <li class="item" data-user-id="${friend.id ? friend.id : friend.to_user}">
                                    <span class="checkbox">
                                        <i class="fa-solid fa-check check-icon"></i>
                                    </span>
                                    <span class="item-text" data-user-id="${friend.id ? friend.id : friend.to_user}" data-server="${serverName}">${friend.displayName}</span>
                                </li>
                                    `;
                                    friendsHtml += friendHtml;
                                });
                                const submitbtnHTML = `
                                <button class="share-posts-btn">Share</button>
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
                                        const server = item.querySelector(".item-text").dataset.server;
                                        selectedFriends.push({ id: item.dataset.userId, server: server });
                                    });
                                    selectedFriends.forEach(friend  => {
                                        if(friend.server==="Beeg Yoshi"){
                                        const friendId = friend.id;
                                        const sharePost = async () => {
                                            const response = await axios.get(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${post.author}/posts/${post.id}/likes`)
                                            console.log(response.data);
                                            const numberOfLikes = response.data.length;
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
                                                numberOfLikes:numberOfLikes,
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
                                    }
                                    else if(friend.server==="A-Team"){
                                        console.log("Also picked A-Team");
                                        friendModal.style.display = "none";
                                    }
                                    else if (friend.server==="Web Weavers"){
                                        console.log("Also picked Web Weavers");
                                        friendModal.style.display = "none";
                                    }
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