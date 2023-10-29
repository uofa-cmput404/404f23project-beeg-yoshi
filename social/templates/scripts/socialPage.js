const friendsList = document.getElementById("friendsList");
const strangersList = document.getElementById("strangersList");
const userData = JSON.parse(localStorage.getItem('userData'));
const backbtn = document.getElementById("backbtn");
const authorId = userData.id;
async function fetchLists() {
    let friends = await axios.get(`http://127.0.0.1:8000/service/authors/${authorId}/friends/`)
    let strangers = await axios.get(`http://127.0.0.1:8000/service/authors/${authorId}/strangers/`)
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

        let button = document.createElement("button");
        button.textContent = buttonText;
        button.addEventListener('click', () => handleButtonClick(user, buttonText));

        li.appendChild(button);
        listElement.appendChild(li);
    });
}
backbtn.addEventListener('click', () => {
    window.location.href = "index.html";
});
function handleButtonClick(user, action) {
    if(action === 'Follow') {
        const follow = async () => {
            try {
                const response= await axios.put(`http://127.0.0.1:8000/service/authors/${user.id}/followers/${authorId}/`)
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
}


fetchLists();
