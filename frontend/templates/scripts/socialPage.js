const friendsList = document.getElementById("friendsList");
const strangersList = document.getElementById("strangersList");
const userData = JSON.parse(localStorage.getItem('userData'));
const followersList = document.getElementById("followersList");
const pendingList = document.getElementById("friendRequestsList");
const Logout = document.querySelector("#logoutBtn")
const nav = document.querySelector(".navLinks")
const authorId = userData.id;
if (userData) {
    console.log(userData)
    if(userData.type==="SERVERADMIN"){
        let li = document.createElement("li");
        li.innerHTML = '<a href="./AdminPage.html">Manage Author Access</a>';
        nav.appendChild(li);
    }
}
async function fetchLists() {
    let friends = await axios.get(`http://127.0.0.1:8000/service/authors/${authorId}/friends/`)
    let strangers = await axios.get(`http://127.0.0.1:8000/service/authors/${authorId}/strangers/`)
    let followers = await axios.get(`http://127.0.0.1:8000/service/authors/${authorId}/followers/`);
    let pending = await axios.get(`http://127.0.0.1:8000/service/authors/${authorId}/request/pending`)
    console.log(pending.data);
    populateList(pendingList, pending.data.items, 'Cancel');
    console.log(followers.data.items);
    populateList(followersList, followers.data.items, '');
    console.log(friends.data);
    console.log(strangers.data);
    populateList(friendsList, friends.data, 'Unfollow');
    populateList(strangersList, strangers.data, 'Follow');
}
function populateList(listElement, users, buttonText) {
    listElement.innerHTML = ''; 

    users.forEach(user => {
        let li = document.createElement("li");
        li.textContent = user.displayName;
        if (buttonText!==''){
        let button = document.createElement("button");
        button.textContent = buttonText;
        button.addEventListener('click', () => handleButtonClick(user, buttonText));
        
        li.appendChild(button);
        }
        listElement.appendChild(li);
        
        
    });
}
function handleButtonClick(user, action) {
    if(action === 'Follow') {
        const follow = async () => {
            try {
                const response= await axios.post(`http://127.0.0.1:8000/service/authors/${authorId}/request/${user.id}/`)
                console.log(response.data)
            } catch (error) {
                console.log(error.response.data)
            }

        }
        follow();
        fetchLists();
    } else if(action === 'Unfollow') {
        const unfollow = async () => {
            try {
                const response= await axios.delete(`http://127.0.0.1:8000/service/authors/${user.id}/followers/${authorId}/`)
                console.log(response.data)
            } catch (error) {
                console.log(error.response.data)
            }

        }
        unfollow();
        fetchLists();
    }
    else if (action === 'Cancel'){
        const cancel = async () => {
            try {
                const response= await axios.delete(`http://127.0.0.1:8000/service/authors/${authorId}/request/${user.id}/`)
            }
            catch (error) {
                console.log(error.response.data)
            }
        }
        cancel();
        fetchLists();
    }
}


fetchLists();

Logout.addEventListener("click", () =>{
    localStorage.removeItem('userData');
    window.location.href="loginPage.html"
})
