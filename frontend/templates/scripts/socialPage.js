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
    let friends = await axios.get(`http://127.0.0.1:8000/service/authors/${authorId}/friends/`, {
        headers: {
            'Authorization': userData.token
        }
    });
    let strangers = await axios.get(`http://127.0.0.1:8000/service/authors/${authorId}/strangers/`)
    let followers = await axios.get(`http://127.0.0.1:8000/service/authors/${authorId}/followers/`);
    let pending = await axios.get(`http://127.0.0.1:8000/service/authors/${authorId}/request/pending`)
    let A_Team_res= await axios.get(`https://c404-5f70eb0b3255.herokuapp.com/authors/`)
    let web_weavers_res= await axios.get(`https://web-weavers-backend-fb4af7963149.herokuapp.com/authors/`)
    let remote_followers= await axios.get(`http://127.0.0.1:8000/service/remote/authors/${authorId}/followers/`)
    remote_followers.data.items.forEach(item => {
        if (item.server==='Web Weavers'){
        web_weavers_res.data.items.forEach(user => {
            if (item.id === user.id){
                web_weavers_res.data.items.splice(web_weavers_res.data.items.indexOf(user),1)
                followers.data.items.push(user)
                return
            }
        })
    }
        else if (item.server==='A-Team'){
        A_Team_res.data.results.items.forEach(user => {
            if (item.id === user.id){
                A_Team_res.data.results.items.splice(A_Team_res.data.results.items.indexOf(user),1)
                followers.data.items.push(user)
                return
            }
        })
    }
    })
    let remoteFriends= await axios.get(`http://127.0.0.1:8000/service/remote/authors/${authorId}/friends/`)
    remoteFriends.data.forEach(item => {
        if (item.server==='Web Weavers'){
        web_weavers_res.data.items.forEach(user => {
            if (item.to_user === user.id){
                web_weavers_res.data.items.splice(web_weavers_res.data.items.indexOf(user),1)
                friends.data.push(user)
                return
            }
        })
    }

        else if (item.server==='A-Team'){
        A_Team_res.data.results.items.forEach(user => {
            if (item.to_user === user.id){
                A_Team_res.data.results.items.splice(A_Team_res.data.results.items.indexOf(user),1)
                friends.data.push(user)
                return
            }
        })
    }
    })
    console.log(remoteFriends.data)
    console.log(remote_followers.data.items)
    console.log(A_Team_res.data.results.items)
    console.log(web_weavers_res.data.items)
    console.log(pending.data);
    console.log(followers.data.items);
    console.log(friends.data);
    console.log(strangers.data);
    populateList(strangersList, A_Team_res.data.results.items, 'Follow');
    populateList(strangersList, web_weavers_res.data.items, 'Follow');
    populateList(pendingList, pending.data.items, 'Cancel');
    populateList(followersList, followers.data.items, '');
    populateList(friendsList, friends.data, 'Unfollow');
    populateList(strangersList, strangers.data, 'Follow');
}
function populateList(listElement, users, buttonText) {

    users.forEach(user => {
        let li = document.createElement("li");
        if (user.host === 'https://c404-5f70eb0b3255.herokuapp.com/'){
            li.textContent = user.displayName+" (A-Team)";
        }
        else if (user.host === 'https://web-weavers-backend-fb4af7963149.herokuapp.com/'){
            li.textContent = user.displayName+" (Web Weavers)";
        }
        else{
        li.textContent = user.displayName + " (Beeg Yoshi)"
        }
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
        if (user.host === 'https://c404-5f70eb0b3255.herokuapp.com/'){ //A-Team
            const follow = async () => {
                try {
                    const response= await axios.post(`https://c404-5f70eb0b3255.herokuapp.com/service/authors/${authorId}/request/${user.id}/`)
                    console.log(response.data)
                } catch (error) {
                    console.log(error.response.data)
                }
    
            }
            follow();
            fetchLists();
        }
        if (user.host === 'https://web-weavers-backend-fb4af7963149.herokuapp.com/'){ //Web Weavers
            const follow = async () => {
                try {
                    const response= await axios.post(`https://web-weavers-backend-fb4af7963149.herokuapp.com/service/authors/${authorId}/request/${user.id}/`)
                    console.log(response.data)
                } catch (error) {
                    console.log(error.response.data)
                }
    
            }
            follow();
            fetchLists();
        }
        else{
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
        }
    } else if(action === 'Unfollow') {
        const unfollow = async () => {
            try {
                const response= await axios.delete(`http://127.0.0.1:8000/service/authors/${user.id}/followers/${authorId}/`)
                console.log(response.data)
                try {
                    const response= await axios.delete(`http://127.0.0.1:8000/service/authors/${authorId}/request/${user.id}/`)
                    console.log(response.data)
                } catch (error) {
                    console.log(error)
                }
            } catch (error) {
                console.log(error)
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
