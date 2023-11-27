const Backbtn = document.getElementById('backButton');
document.addEventListener("DOMContentLoaded", () => {
    const activeUserList = document.getElementById('activeUserList');
    const inactiveUserList = document.getElementById('inactiveUserList');
    const users = [];
    const fetchAuthors = async () => {
        try {
            const response = await axios.get('https://beeg-yoshi-social-distribution-50be4cf2bba8.herokuapp.com/service/authors/')
            users.push(...response.data);
            users.forEach(user => {
                const userItem = document.createElement('div');
                userItem.className = 'user-item';
                userItem.textContent = user.displayName;
                const actionButton = document.createElement('button');
                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'button-container';
                const toggleUserActivity = async (userId, isActive) => {
                    const data = {
                        is_active: isActive
                    }
                    try {
                        const response = await axios.post(`https://beeg-yoshi-social-distribution-50be4cf2bba8.herokuapp.com/service/authors/${userId}/`,data);
                        console.log(response.data);
                    } catch (error) {
                        console.log(error);
                    }
                }
                const deleteUser = async (userId) => {
                    try {
                        const response = await axios.delete(`https://beeg-yoshi-social-distribution-50be4cf2bba8.herokuapp.com/service/authors/${userId}/`);

                    }catch(error) {
                        console.log(error);
                    }
                }
                const editUser = (user) => {
                    const modal = document.getElementById('editUserModal');
                    const form = document.getElementById('editUserForm');
                    modal.style.display = 'block';
                    document.getElementById('userId').value = user.id;
                    document.getElementById('userName').value = user.displayName || '';
                    document.getElementById('userEmail').value = user.email || '';
                    document.getElementById('Github').value = user.github || '';
                    document.getElementById('Password').value = user.password || '';
                    document.querySelector('.close-button').onclick = function() {
                        document.getElementById('editUserModal').style.display = 'none';
                    };
                    form.onsubmit = async (event) => {
                        event.preventDefault();
                        const data={
                            displayName:document.getElementById('userName').value,
                            email:document.getElementById('userEmail').value,
                            github:document.getElementById('Github').value,
                            password:document.getElementById('Password').value
                        }
                        try {
                            const response= await axios.post(`https://beeg-yoshi-social-distribution-50be4cf2bba8.herokuapp.com/service/authors/${user.id}/`, data)
                            console.log(response.data)
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }
                actionButton.textContent = user.is_active ? 'Deactivate' : 'Activate';
                actionButton.onclick = () => toggleUserActivity(user.id, !user.is_active);
                buttonContainer.appendChild(actionButton);
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => deleteUser(user.id);
                buttonContainer.appendChild(deleteButton);
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.onclick = () => editUser(user);
                buttonContainer.appendChild(editButton);
                userItem.appendChild(buttonContainer);
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