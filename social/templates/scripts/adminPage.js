const Backbtn = document.getElementById('backButton');
document.addEventListener("DOMContentLoaded", () => {
    const activeUserList = document.getElementById('activeUserList');
    const inactiveUserList = document.getElementById('inactiveUserList');
    const users = [];
    const fetchAuthors = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/service/authors/')
            users.push(...response.data);
            users.forEach(user => {
                const userItem = document.createElement('div');
                userItem.className = 'user-item';
                userItem.textContent = user.displayName;
                const actionButton = document.createElement('button');
                const toggleUserActivity = async (userId, isActive) => {
                    const data = {
                        is_active: isActive
                    }
                    try {
                        const response = await axios.post(`http://127.0.0.1:8000/service/authors/${userId}/`,data);
                        console.log(response.data);
                    } catch (error) {
                        console.log(error);
                    }
                }
                actionButton.textContent = user.is_active ? 'Deactivate' : 'Activate';
                actionButton.onclick = () => toggleUserActivity(user.id, !user.is_active);
                userItem.appendChild(actionButton);
                if (user.is_active) {
                    activeUserList.appendChild(userItem);
                } else {
                    inactiveUserList.appendChild(userItem);
                }
            });
        }catch(error) {
            console.log(error)
        }
    }
    fetchAuthors();
});
Backbtn.addEventListener('click', () => {
    window.location.href = "index.html";
});