const Backbtn = document.getElementById('backButton');
document.addEventListener("DOMContentLoaded", () => {
    const activeUserList = document.getElementById('activeUserList');
    const inactiveUserList = document.getElementById('inactiveUserList');
    const nodeConnectionList = document.getElementById('nodeConnectionList');
    const users = [];
    const fetchAuthors = async () => {
        try {
            const response = await axios.get('https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/')
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
                        const response = await axios.post(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${userId}/`,data);
                        console.log(response.data);
                        window.location.reload();
                    } catch (error) {
                        console.log(error);
                    }
                }
                const deleteUser = async (userId) => {
                    try {
                        const response = await axios.delete(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${userId}/`);
                        window.location.reload();

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
                    document.getElementById('Github').value = user.github || '';
                    document.getElementById('Password').value = user.password || '';
                    document.querySelector('.close-button').onclick = function() {
                        document.getElementById('editUserModal').style.display = 'none';
                    };
                    form.onsubmit = async (event) => {
                        event.preventDefault();
                        const data={
                            displayName:document.getElementById('userName').value,
                            github:document.getElementById('Github').value,
                            password:document.getElementById('Password').value
                        }
                        try {
                            const response= await axios.post(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/authors/${user.id}/`, data)
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
    const fetchNodeConnections = async () => {
        try {
            const response = await axios.get('https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/admin/node/');
            
            response.data.forEach(nodeConnection => {
                console.log(nodeConnection);
                const nodeConnectionItem = document.createElement('div');
                nodeConnectionItem.className = 'user-item';
                nodeConnectionItem.textContent = nodeConnection.name + " is ";
                const statusWords= nodeConnection.active? 'active' : 'inactive';
                nodeConnectionItem.textContent+= statusWords;
                const actionButton = document.createElement('button');
                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'button-container';
                const deleteNodeConnection = async (nodeConnection) => {
                    console.log(nodeConnection);
                    console.log("delete is called");

                    try {
                        const data={
                            name:nodeConnection.name,
                        }
                        const response = await axios.put(`https://beeg-yoshi-backend-858f363fca5e.herokuapp.com/service/admin/node/`, data);
                        window.location.reload();
                    }catch(error) {
                        console.log(error);
                    }
                }
                actionButton.textContent = nodeConnection.active ? 'Deactivate' : 'Activate';
                actionButton.onclick = () => deleteNodeConnection(nodeConnection);
                buttonContainer.appendChild(actionButton);
                nodeConnectionItem.appendChild(buttonContainer);
                nodeConnectionList.appendChild(nodeConnectionItem);
            });
        }catch(error) {
            console.log(error)
        }
    }
    fetchNodeConnections();
});
Backbtn.addEventListener('click', () => {
    window.location.href = "Dashboard.html";
});