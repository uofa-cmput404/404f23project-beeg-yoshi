const editModal = document.querySelector("[data-modal]");
const nav = document.querySelector(".navLinks");
const editProfileBtn = document.querySelector("#edit-profile-btn");
const exitEditBtn = document.querySelector("[data-close-modal]");
const confirmEditBtn = document.querySelector("#confirmEditBtn");
const Name = document.querySelector("#handle");
const bio = document.querySelector("#bio");
const userData = JSON.parse(localStorage.getItem('userData'));
const GithubBtn = document.querySelector("#github-handle");
const activityFeed = document.querySelector('.activity-feed');
const loadMoreBtn = document.querySelector('#loadMoreBtn');

GithubBtn.href = userData.github;
let allActivities = [];
let isAllActivitiesLoaded = false;

const renderActivity = (activity) => {
    const activityCard = document.createElement('div');
    activityCard.className = 'activity-card';
    const title = document.createElement('div');
    title.className = 'activity-title';
    title.textContent = `In the repo ${activity.repo.name}`;
    const date = document.createElement('div');
    date.className = 'activity-date';
    date.textContent = new Date(activity.created_at).toLocaleDateString();
    const details = document.createElement('div');
    details.textContent = `Action: ${activity.type}`;
    activityCard.appendChild(title);
    activityCard.appendChild(date);
    activityCard.appendChild(details);
    if (activity.type === 'PushEvent') {
        const commits = document.createElement('ul');
        activity.payload.commits.forEach(commit => {
            const commitItem = document.createElement('li');
            commitItem.textContent = commit.message;
            commits.appendChild(commitItem);
        });
        activityCard.appendChild(commits);
    }

    activityFeed.appendChild(activityCard);
};
const fetchActivities = async () => {
    const gitURL = userData.github;
    const user = gitURL.split("/")[3];
    const apiURL = `https://api.github.com/users/${user}/events`;
    try {
        const response = await axios.get(apiURL);
        allActivities = response.data;
        console
        allActivities.slice(0, 5).forEach(renderActivity);
        if (allActivities.length > 5) {
            loadMoreBtn.style.display = 'block';
        }
    } catch (error) {
        console.error('Error fetching GitHub activities:', error);
    }
};
fetchActivities();
loadMoreBtn.addEventListener('click', () => {
    if (!isAllActivitiesLoaded) {
        allActivities.forEach(renderActivity);
        isAllActivitiesLoaded = true;
        loadMoreBtn.style.display = 'none';
    }
});
if (userData) {
    console.log(userData)
    if(userData.type==="SERVERADMIN"){
        let li = document.createElement("li");
        li.innerHTML = '<a href="./AdminPage.html">Manage Access</a>';
        nav.appendChild(li);
    }
}
document.querySelector("#userHandle").value=userData.displayName
document.querySelector("#userGithub").value=userData.github
document.querySelector("#editBio").value=userData.biography
Name.innerHTML=userData.displayName
bio.innerHTML=userData.biography
editProfileBtn.addEventListener("click", () =>{
    editModal.show()
})
exitEditBtn.addEventListener("click", () =>{
    editModal.close()
})
confirmEditBtn.addEventListener("click", async () => {
    console.log("Submit the changes here")
        const data={
            displayName:document.querySelector("#userHandle").value,
            biography:document.querySelector("#editBio").value,
            github:document.querySelector("#userGithub").value,
        }
        if (document.querySelector("#userPasswordNew").value !== ""){
            data.password=document.querySelector("#userPasswordNew").value
        }
        console.log(data)
        try {
            const response= await axios.post(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${userData.id}/`, data)
            console.log(response.data)
            userData.displayName = data.displayName;
            userData.biography = data.biography;
            userData.github = data.github;
            localStorage.setItem('userData', JSON.stringify(userData));
            Name.textContent = userData.displayName;
            bio.textContent = userData.biography;

        } catch (error) {
            console.log(error);
        }
        editModal.close()
        window.location.reload()
});
