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

// Nodes: <you might have to "createElement" instead>
const friendRqNode = document.querySelector("#friendRqnode");
const likedNode = document.querySelector("#likedNode");
const commentedNode = document.querySelector("#commentedNode");
const inboxNode = document.querySelector("#inboxNode"); // Clicking this also opens "inboxNodeModal"

// Nested divs in the nodes: <you might have to "createElement" instead>
const sender = document.querySelector(".sender");
const likedIcon = document.querySelector("#likedIcon");
const commentedIcon = document.querySelector("#commentedIcon");
const genericHolder = document.querySelector(".genericHolder"); // Holds the below 2.
const acceptBtn = document.querySelector(".accept");
const declineBtn = document.querySelector(".decline");

// Extras: 
const clearBtn = document.querySelector("#clearBtn");
const confirmClearModal = document.querySelector("[data-modal]");
const confirmClearBtn = document.querySelector("#confirmClear");
const cancelClearBtn = document.querySelector("#cancelClear");

// Modal Stuff
const inboxNodeModal = document.getElementById("inboxNodeModal");
const closeInboxNodeBtn = document.querySelector(".close");


// Query the database / get the notifcation-type (friendRq, liked/commentd, inbox): TODO

// Add the node in to the correct stream.


// inboxNode: Clicking the sent post opens up an expanded version of the post.
inboxNode.addEventListener("click", () =>{
    console.log('node clicked');
    inboxNodeModal.style.display = "block";
    document.body.style.overflow = "hidden"; /* locks the background when modal is open */
})

closeInboxNodeBtn.addEventListener("click", () => {
    inboxNodeModal.style.display="none";
    document.body.style.overflow = "auto"; /* unlocks the background */
})

// Clear Modal + Confirm
clearBtn.addEventListener("click", () =>{
    confirmClearModal.showModal();
})

confirmClearBtn.addEventListener("click", () =>{
    console.log("CLEAR ALL NOTIFICATIONS"); // TODO
    confirmClearModal.close();
})

cancelClearBtn.addEventListener("click", () =>{
    console.log("Do not clear notifcations");
    confirmClearModal.close();
})