// Each node has a sender, and potentially other nested divs.
// Steps:
// 1) Grab the node
// 2) Grab the content for the node (by querying database)
// 3) Grab the NAME of the SENDER of the notifcation.
// 4) ADD the node to the DOM.
// 5) Add all the nested divs that node has.
// 6) Adjust ".sender" text to be: "<SENDER> liked/commented/shared ..."

// Streams:
var friendRqStream = document.querySelector(".friendRqStream");
var likedCommentedStream = document.querySelector(".likedCommentedStream");
var inboxStream = document.querySelector(".inboxStream");

// Nodes:
var friendRqNode = document.querySelector("#friendRqnode");
var likedNode = document.querySelector("#likedNode");
var commentedNode = document.querySelector("#commentedNode");
var inboxNode = document.querySelector("#inboxNode");

// Nested divs in the nodes:
var sender = document.querySelector(".sender");
var likedIcon = document.querySelector("#likedIcon");
var commentedIcon = document.querySelector("#commentedIcon");
var genericHolder = document.querySelector(".genericHolder"); // Holds the below 2.
var acceptBtn = document.querySelector("#accept");
var declineBtn = document.querySelector("#decline");

// Extras:
var clearBtn = document.querySelector("clearBtn");

// Query the database / get the notifcation-type (friendRq, liked/commentd, inbox): TODO

// Add the node in to the correct stream.
