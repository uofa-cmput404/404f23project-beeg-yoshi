// Each node has a sender, and potentially other nested divs.
// Steps:
// 1) Grab the node
// 2) Grab the content for the node (by querying database)
// 3) Grab the NAME of the SENDER of the notifcation.
// 4) ADD the node to the DOM.
// 5) Add all the nested divs that node has.
// 6) Adjust ".sender" text to be: "<SENDER> liked/commented/shared ..."

// Streams:
const friendRqStream = document.querySelector(".friendRqStream");
const likedCommentedStream = document.querySelector(".likedCommentedStream");
const inboxStream = document.querySelector(".inboxStream");
const userData = JSON.parse(localStorage.getItem('userData'));
// Nodes: <you might have to "createElement" instead>
const friendRqNode = document.querySelector("#friendRqnode");
const likedNode = document.querySelector("#likedNode");
const commentedNode = document.querySelector("#commentedNode");
// Nested divs in the nodes: <you might have to "createElement" instead>
const sender = document.querySelector(".sender");
const likedIcon = document.querySelector("#likedIcon");
const commentedIcon = document.querySelector("#commentedIcon");
const genericHolder = document.querySelector(".genericHolder"); // Holds the below 2.
const acceptBtn = document.querySelector(".accept");
const declineBtn = document.querySelector(".decline");
const Logout = document.querySelector("#logoutBtn")
// Extras: 
const clearBtn = document.querySelector("#clearBtn");
const confirmClearModal = document.querySelector("[data-modal]");
const confirmClearBtn = document.querySelector("#confirmClear");
const cancelClearBtn = document.querySelector("#cancelClear");
const inboxNodeModal = document.getElementById("inboxNodeModal");
let friendRequestsList = [];
let notificationsList = [];
let inboxList = [];
const fetchInbox= async () => {
    try {
        const response= await axios.get(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${userData.id}/inbox/`)
        console.log(response.data)
        friendRequestsList = response.data.items["friendrequests"];
        console.log(friendRequestsList)
        notificationsList = response.data.items["notifications"];
        console.log(notificationsList)
        inboxList = response.data.items["inbox"];
        console.log(inboxList)
        friendRqStream.innerHTML = '<h1>Friend Requests</h1>';

        friendRequestsList.forEach(request => {
            const node = document.createElement("div");
            node.id = "friendRqNode";
            node.innerHTML = `
                <div class="sender">${request.from_user_name} sent you a friend request.</div>
                <div class="genericContainer">
                    <div id="decline">Decline</div> <!-- These will act as buttons. Give them onclick.-->
                    <div id="accept">Accept</div> 
                </div>
            `;
    
            // Add event listeners for accept and decline
            node.querySelector('#accept').addEventListener('click', () => handleAccept(request,friendRequestsList,notificationsList,inboxList));
            node.querySelector('#decline').addEventListener('click', () => handleDecline(request,friendRequestsList,notificationsList,inboxList));
    
            friendRqStream.appendChild(node);
            
        });
        inboxStream.innerHTML = '<h1>Inbox</h1>';
        inboxList.forEach(message => {
            const node = document.createElement("div");
            node.id = "inboxNode";
            node.innerText = `${message.senderName} Sent a post to you`;
            const postModalhtml = `<div class="modal-content">
            <div class="modal-header">
                <h1>${message.senderName} Sent a post by share to you:</h1>
                <span class="close">&times;</span>
            </div>

            <div class="modal-body" style="overflow-y: auto; max-height: 450px;">
                <p id="postContent">${message.post}</p>
                ${message.images.map(image => `<img src="${image}" alt="Image" style="width: 400px; max-height: 500px;">`).join('')}
            </div>
            <div class="modal-footer">
                <img src="../images/likeIcon.png" alt="">
            </div>

            
        </div>`
        node.addEventListener("click", () => {
            inboxNodeModal.innerHTML = postModalhtml;
            document.body.style.overflow = "hidden";
            inboxNodeModal.style.display = "block";
            const closeInboxNodeBtn = document.querySelector(".close");
            closeInboxNodeBtn.addEventListener("click", () => {
                inboxNodeModal.style.display="none";
                document.body.style.overflow = "auto"; /* unlocks the background */
            })
            })
            inboxStream.appendChild(node);
        });

    }catch (error) {
        console.log(error)
    }
}
fetchInbox();
// Query the database / get the notifcation-type (friendRq, liked/commentd, inbox): TODO

// Add the node in to the correct stream.


// inboxNode: Clicking the sent post opens up an expanded version of the post.


// Clear Modal + Confirm
clearBtn.addEventListener("click", () =>{
    confirmClearModal.showModal();
})

confirmClearBtn.addEventListener("click", () =>{
    const data={"inbox":[], "notifications":notificationsList, "friendrequests":friendRequestsList}
    const clearNotifications = async () => {
        try {
            await axios.put(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${userData.id}/inbox/`,data)
            window.location.reload();
        } catch (error) {
            console.log(error)
        }
    }
    clearNotifications();
    confirmClearModal.close();
})

cancelClearBtn.addEventListener("click", () =>{
    console.log("Do not clear notifcations");
    confirmClearModal.close();
})
Logout.addEventListener("click", () =>{
    localStorage.removeItem('userData');
    window.location.href="index.html"
})

// Handle accept
function handleAccept(request,friendsList,notificationsList,inboxList) {
    if (request.server==='A-Team'){
        console.log("A-Team accept")
        //send a put to the remote friend request accept the request and create a friendship
        //send a request to A-Team to add the friend
        const createRemoteFriendship = async () => {
        try {
            const index=friendsList.indexOf(request);
            friendsList.splice(index,1);
            const data={
                server: "A-Team",
                "friendrequests":friendsList
            }
            const response = await axios.put(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/remote/authors/${request.from_user}/request/${userData.id}/`, data)
            console.log(response.data)
            window.location.reload();
        } catch (error) {
            console.log(error)
        }
    }
    createRemoteFriendship();
    }
    else if (request.server==='Web Weavers'){
        const createRemoteFriendship = async () => {
            try {
                const index=friendsList.indexOf(request);
                friendsList.splice(index,1);
                const data={
                    server: "Web Weavers",
                    "friendrequests":friendsList
                }
                const response = await axios.put(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/remote/authors/${request.from_user}/request/${userData.id}/`, data)
                console.log(response.data)
                window.location.reload();
            } catch (error) {
                console.log(error)
            }
        }
        createRemoteFriendship();
    }
    else{
    const index=friendsList.indexOf(request);
    friendsList.splice(index,1);
    const data={"inbox":inboxList,"notifications":notificationsList,"friendrequests":friendsList}
    const createFriendship = async () => {  
        try {
            const response= await axios.put(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${userData.id}/followers/${request.from_user}/`,data,{
                headers: {
                    'Authorization': userData.token
                }
            });
            console.log(response.data)
            try {
                const response= await axios.put(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${request.from_user}/request/${userData.id}/`)
                console.log(response.data)
                window.location.reload();
            } catch (error) {
                console.log(error)
            }
        } catch (error) {
            console.log(error)
        }
    }
    createFriendship();
    fetchInbox();
}
}

// Handle decline
function handleDecline(request,friendsList,notificationsList,inboxList) {
    if (request.server==='A-Team'){
        console.log("A-Team decline")
        const declineRemoteFriendshipRequest = async () => {
        try {
            const response= await axios.delete(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/remote/authors/${request.from_user}/request/${userData.id}/`)
            window.location.reload();
        } catch (error) {
            console.log(error)
        }
        }
        declineRemoteFriendshipRequest();
    }
    else if (request.server==='Web Weavers'){
        const declineRemoteFriendshipRequest = async () => {
            try {
                const response= await axios.delete(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/remote/authors/${request.from_user}/request/${userData.id}/`)
                window.location.reload();
            } catch (error) {
                console.log(error)
            }
            }
            declineRemoteFriendshipRequest();
    }
    else{
    const index=friendsList.indexOf(request);
    friendsList.splice(index,1);
    const data={"inbox":inboxList,"notifications":notificationsList,"friendrequests":friendsList}
    const deleteFriendshipRequest = async () => {
    try {
        await axios.put(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${userData.id}/inbox/`,data)
        try {
            const response= await axios.delete(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${request.from_user}/request/${userData.id}/`)
            window.location.reload();
        }
            catch (error) {
                console.log(error)
            }
    } catch (error) {
        console.log(error)
    }
}
    deleteFriendshipRequest();
    fetchInbox();
}
}