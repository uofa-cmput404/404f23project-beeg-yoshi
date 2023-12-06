const friendsList = document.getElementById("friendsList");
const strangersList = document.getElementById("strangersList");
const userData = JSON.parse(localStorage.getItem('userData'));
const followersList = document.getElementById("followersList");
const pendingList = document.getElementById("friendRequestsList");
const Logout = document.querySelector("#logoutBtn")
const nav = document.querySelector(".navLinks")
const authorId = userData.id;
const usernameWebWeavers = 'beeg-yoshi';
const passwordWebWeavers = '12345';
const encodedCredentials = btoa(`${usernameWebWeavers}:${passwordWebWeavers}`);
if (userData) {
    console.log(userData)
    if(userData.type==="SERVERADMIN"){
        let li = document.createElement("li");
        li.innerHTML = '<a href="./AdminPage.html">Manage Access</a>';
        nav.appendChild(li);
    }
}
async function fetchLists() {
    const res= await axios.get(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/admin/node/`)
    const Web_Weaver_connection=res.data[0]
    const A_Team_connection=res.data[1]
    console.log(Web_Weaver_connection)
    console.log(A_Team_connection)
    let friends = await axios.get(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${authorId}/friends/`, {
        headers: {
            'Authorization': userData.token
        }
    });
    let strangers = await axios.get(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${authorId}/strangers/`)
    let followers = await axios.get(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${authorId}/followers/`);
    let pending = await axios.get(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${authorId}/request/pending`)
    let pending_remote= await axios.get(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/remote/authors/${authorId}/pending/request/`)
    let A_Team_res= await axios.get(`https://c404-5f70eb0b3255.herokuapp.com/authors/`)
    let web_weavers_res= await axios.get(`https://web-weavers-backend-fb4af7963149.herokuapp.com/authors/`, {
        headers: {
            'Authorization': `Basic ${encodedCredentials}`
        }
    })
    // web_weavers_res.data.items.forEach(user => {
    //     if (user.host!=='https://web-weavers-backend-fb4af7963149.herokuapp.com/'){
    //         console.log("flitered out")
    //         web_weavers_res.data.items.splice(web_weavers_res.data.items.indexOf(user),1)
    // }
    // })
    let remote_followers= await axios.get(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/remote/authors/${authorId}/followers/`)
    remote_followers.data.items.forEach(item => {
        if (item.server==='Web Weavers' && Web_Weaver_connection.active){
        web_weavers_res.data.items.forEach(user => {
            if (item.id === user.uuid){
                followers.data.items.push(user)
                return
            }
        })
    }
        else if (item.server==='A-Team' && A_Team_connection.active){
        A_Team_res.data.results.items.forEach(user => {
            if (item.id === user.id){
                followers.data.items.push(user)
                return
            }
        })
    }
    })
    let remoteFriends= await axios.get(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/remote/authors/${authorId}/friends/`)
    remoteFriends.data.forEach(item => {
        if (item.server==='Web Weavers' && Web_Weaver_connection.active){
        web_weavers_res.data.items.forEach(user => {
            if (item.to_user === user.uuid){
                web_weavers_res.data.items.splice(web_weavers_res.data.items.indexOf(user),1)
                friends.data.push(user)
                return
            }
        })
    }

        else if (item.server==='A-Team' && A_Team_connection.active){
        A_Team_res.data.results.items.forEach(user => {
            if (item.to_user === user.id){
                A_Team_res.data.results.items.splice(A_Team_res.data.results.items.indexOf(user),1)
                friends.data.push(user)
                return
            }
        })
    }
    })
    pending_remote.data.items.forEach(item => {
        if (item.server==='Web Weavers' && Web_Weaver_connection.active){
        web_weavers_res.data.items.forEach(user => {
            if (item.id === user.uuid){
                web_weavers_res.data.items.splice(web_weavers_res.data.items.indexOf(user),1)
                pending.data.items.push(user)
                return
            }
        })
    }

        else if (item.server==='A-Team' && A_Team_connection.active){
        A_Team_res.data.results.items.forEach(user => {
            if (item.id === user.id){
                A_Team_res.data.results.items.splice(A_Team_res.data.results.items.indexOf(user),1)
                pending.data.items.push(user)
                return
            }
        })
    }
    })
    console.log(pending_remote.data.items)
    console.log(remoteFriends.data)
    console.log(remote_followers.data.items)
    console.log(A_Team_res.data.results.items)
    console.log(web_weavers_res.data.items)
    console.log(pending.data);
    console.log(followers.data.items);
    console.log(friends.data);
    console.log(strangers.data);
    if(A_Team_connection.active){
        populateList(strangersList, A_Team_res.data.results.items, 'Follow');
    }
    if(Web_Weaver_connection.active){
        populateList(strangersList, web_weavers_res.data.items, 'Follow');
    }
    populateList(pendingList, pending.data.items, 'Cancel');
    populateList(followersList, followers.data.items, '');
    populateList(friendsList, friends.data, 'Unfollow');
    populateList(strangersList, strangers.data, 'Follow');
}
function populateList(listElement, users, buttonText) {
    users.forEach(user => {
        
        let li = document.createElement("li");
        li.setAttribute('data-user-id', user.id);
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
        button.addEventListener('click', (event) => {
            event.preventDefault();
            handleButtonClick(user, buttonText)});
        
        li.appendChild(button);
        }
        listElement.appendChild(li);
        
        
    });
}
function handleButtonClick(user, action) {
    if(action === 'Follow') {
        if (user.host === 'https://c404-5f70eb0b3255.herokuapp.com/'){ //A-Team
            const follow = async () => {
            try{
                const id=String(userData.id)
                console.log(typeof(id))
                const data= {
                    actor:String(id)
                }
                const response= await axios.post(`https://c404-5f70eb0b3255.herokuapp.com/authors/${user.id}/followRequests/`, data, {
                    headers: {
                        'Authorization': "Token e99281997c1aad7dbc54e0c9b6414a9b3065339a",
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                })
                console.log(response.data)
                try {
                    const data1= {
                        server: 'A-Team',
                    }
                    const response1= await axios.post(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/remote/authors/${userData.id}/request/${user.id}/`,data1)
                    console.log(response1.data)
                    removeFromList(strangersList, user.id);
                    addToList(pendingList, user, 'Cancel');
                }catch (error) {
                    console.log(error)
                }
            } catch (error) {
                console.log(error)
            }
            }
            follow();
            
        }
        else if (user.host === 'https://web-weavers-backend-fb4af7963149.herokuapp.com/'){ //Web Weavers
            const follow = async () => {
                try {
                    let urlSend=String(userData.url)
                    urlSend=urlSend.slice(0,-1)
                    const data={
                        type: "Follow",
                        summary: `${userData.displayName} wants to follow you`,
                        actor: urlSend,
                        object: user.id,
                    }
                    const response= await axios.post(`https://web-weavers-backend-fb4af7963149.herokuapp.com/authors/${user.uuid}/inbox/`,data, {
                        headers: {
                            'Authorization': `Basic ${encodedCredentials}`
                        }
                    })
                    console.log(response.data)
                    try {
                        const data1= {
                            server: 'Web Weavers',
                        }
                        console.log(userData.id)
                        const response1= await axios.post(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/remote/authors/${userData.id}/request/${user.uuid}/`,data1)
                        console.log(response1.data)
                        removeFromList(strangersList, user.id);
                        addToList(pendingList, user, 'Cancel');
                    }catch (error) {
                        console.log(error)
                    }
                } catch (error) {
                    console.log(error)
                }
    
            }
            follow();
        }
        else if (user.host === `https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/`){
            const follow = async () => {
                try {
                    const response= await axios.post(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${authorId}/request/${user.id}/`)
                    console.log(response.data)
                    removeFromList(strangersList, user.id);
                    addToList(pendingList, user, 'Cancel');
                } catch (error) {
                    console.log(error)
                }

            }
        
        follow();
        }
    }
     else if(action === 'Unfollow') {
        if (user.host === 'https://c404-5f70eb0b3255.herokuapp.com/'){ //A-Team
            const unfollow = async () => {
                try {
                    const id=String(userData.id)
                    console.log(typeof(id))
                    const data= {
                        actor:String(id)
                    }
                    const response= await axios.delete(`https://c404-5f70eb0b3255.herokuapp.com/authors/${user.id}/followers/${userData.id}/`, {
                        headers: {
                            'Authorization': "Token e99281997c1aad7dbc54e0c9b6414a9b3065339a",
                    }})
                    console.log(response.data)
                    try {
                        const response= await axios.delete(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/remote/authors/${userData.id}/request/${user.id}/`)
                        console.log(response.data)
                        removeFromList(friendsList, user.id);
                        addToList(strangersList, user, 'Follow');
                    } catch (error) {
                        console.log(error)
                    }
                } catch (error) {
                    console.log(error)
                }
    
            }
            unfollow();
     }
        else if (user.host === 'https://web-weavers-backend-fb4af7963149.herokuapp.com/'){ //Web Weavers    
            const unfollow = async () => {
                try {
                    const data={
                        actor: `${userData.id}`,
                    }
                    const response= await axios.delete(`${user.url}/followers/${userData.id}/`, { headers:{
                        'Authorization': `Basic ${encodedCredentials}`
                    },data: data})
                    console.log(response.data)
                    try {
                        const response= await axios.delete(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/remote/authors/${authorId}/request/${user.uuid}/`)
                        console.log(response.data)
                        removeFromList(friendsList, user.id);
                        addToList(strangersList, user, 'Follow');
                    } catch (error) {
                        console.log(error)
                    }
                } catch (error) {
                    console.log(error)
                }
    
            }
            unfollow();
    }
        else if (user.host === `https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/`){
        
        const unfollow = async () => {
            try {
                const response= await axios.delete(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${user.id}/followers/${authorId}/`)
                console.log(response.data)
                try {
                    const response= await axios.delete(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${userData.id}/request/${user.id}/`)
                    console.log(response.data)
                    removeFromList(friendsList, user.id);
                    addToList(strangersList, user, 'Follow');
                } catch (error) {
                    console.log(error)
                }
            } catch (error) {
                console.log(error)
            }

        }
        unfollow();
    }
}
    else if (action === 'Cancel'){
        if (user.host === 'https://c404-5f70eb0b3255.herokuapp.com/'){ //A-Team
            const cancel = async () => {
                try {
                    const id=String(userData.id)
                    console.log(typeof(id))
                    const data= {
                        actor:String(id)
                    }
                    await axios.delete(`https://c404-5f70eb0b3255.herokuapp.com/authors/${user.id}/followRequests/`,{data:data})
                    try {
                        const response= await axios.delete(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/remote/authors/${userData.id}/request/${user.id}/`)
                        removeFromList(pendingList, user.id);
                        addToList(strangersList, user, 'Follow');
                    } catch (error) {
                        console.log(error)
                    }
                }
                catch (error) {
                    console.log(error)
                }
            }
            cancel();
        }
        if (user.host === 'https://web-weavers-backend-fb4af7963149.herokuapp.com/'){ //Web Weavers
            const cancel = async () => {
                try {
                    let urlSend=String(userData.url)
                    urlSend=urlSend.slice(0,-1)
                    const data={
                        actor: urlSend,
                        object: user.id,
                    }
                    const response= await axios.delete(`https://web-weavers-backend-fb4af7963149.herokuapp.com/follow-requests/`,{data:data}, {
                        headers: {
                            'Authorization': `Basic ${encodedCredentials}`
                        }
                    })
                    console.log(response.data)
                    try {
                        const response1 = await axios.delete(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/remote/authors/${userData.id}/request/${user.uuid}/`)
                        console.log(response1.data)
                        removeFromList(pendingList, user.id);
                        addToList(strangersList, user, 'Follow');
                    } catch (error) {
                        console.log(error)
                    }
                }
                catch (error) {
                    console.log(error.response.data)
                }
            }
            cancel();
        }
        else if (user.host === `https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/`){
        const cancel = async () => {
            try {
                const response= await axios.delete(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${authorId}/request/${user.id}/`)
                console.log(response.data)
                removeFromList(pendingList, user.id);
                addToList(strangersList, user, 'Follow');
            }
            catch (error) {
                console.log(error.response.data)
            }
        }
        cancel();
    }
}
}


fetchLists();

Logout.addEventListener("click", (event) =>{
    event.preventDefault();
    localStorage.removeItem('userData');
    window.location.href="index.html"
})
function removeFromList(listElement, userId) {
    console.log(userId)
    const items = listElement.querySelectorAll('li[data-user-id]');
    items.forEach(item => {
        console.log(item)
        if (item.getAttribute('data-user-id') === userId.toString()) {
            listElement.removeChild(item);
        }
    });
}

function addToList(listElement, user, buttonText) {
    let li = document.createElement('li');
    li.dataset.userId = user.id;
    if (user.host === 'https://c404-5f70eb0b3255.herokuapp.com/'){
        li.textContent = user.displayName+" (A-Team)";
    }
    else if (user.host === 'https://web-weavers-backend-fb4af7963149.herokuapp.com/'){
        li.textContent = user.displayName+" (Web Weavers)";
    }
    else{
    li.textContent = user.displayName + " (Beeg Yoshi)"
    }
    if (buttonText !== '') {
        let button = document.createElement('button');
        button.textContent = buttonText;
        button.addEventListener('click', (event) => {
            event.preventDefault();
            handleButtonClick(user, buttonText);
        });
        li.appendChild(button);
    }
    listElement.appendChild(li);
}