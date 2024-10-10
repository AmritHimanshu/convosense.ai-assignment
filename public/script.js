// const BASEURL = 'https://convosense-ai-assignment.vercel.app/api';
const BASEURL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {

    const FORM = document.getElementById('USER_INPUT_FORM');
    const TABLEBODY = document.querySelector('tbody');
    const SUBMITBTN = document.getElementById('FORM_BUTTON');
    const USERINPUTID = document.getElementById('USER_Id');

    FORM.addEventListener('submit', async (e) => {
        e.preventDefault();

        const userId = USERINPUTID.value;
        const userData = {
            name: document.getElementById('NAME').value,
            age: parseInt(document.getElementById('AGE').value),
            gender: document.getElementById('GENDER').value,
            phone: document.getElementById('PHONE_NUMBER').value,
            email: document.getElementById('EMAIL').value
        };

        try {
            if (userId) {
                const res = await fetch(`${BASEURL}/user/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                if (res.status !== 201) {
                    console.log(res.error);
                    return alert("Some error occured");
                }

                const data = await res.json();

                alert(`${data.message}`);
            }
            else {
                const res = await fetch(`${BASEURL}/user`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                if (res.status !== 201) {
                    console.log(res.error);
                    return alert("Some error occured");
                }

                const data = await res.json();

                alert(`${data.message}`);
            }

            FORM.reset();
            USERINPUTID.value = '';

            fetchUsers();
        } catch (error) {
            console.error(error);
            alert('An error occurred while submitting the form');
        }
    });

    async function handleEdit(e) {
        const userId = e.target.getAttribute('data-id');

        try {
            const res = await fetch(`${BASEURL}/user/${userId}`, {
                method: 'GET'
            });

            if (res.status !== 201) {
                console.log(res.error);
                return alert("Some error occured");
            }

            const user = await res.json();

            document.getElementById('NAME').value = user.name;
            document.getElementById('AGE').value = user.age;
            document.getElementById('GENDER').value = user.gender;
            document.getElementById('PHONE_NUMBER').value = user.phone;
            document.getElementById('EMAIL').value = user.email;
            USERINPUTID.value = user._id;

            SUBMITBTN.textContent = 'Update';

            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error(error);
            alert('An error occurred while editing user');
        }
    };

    async function handleDelete(e) {
        const userId = e.target.getAttribute('data-id');

        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const res = await fetch(`${BASEURL}/user/${userId}`, {
                method: 'DELETE'
            });

            if (res.status !== 201) {
                console.log(res.error);
                return alert("Some error occured");
            }

            alert('User deleted successfully');
            fetchUsers();
        } catch (error) {
            console.error(error);
            alert('An error occurred while deleting user');
        }
    };

    function populateTable(users) {
        TABLEBODY.innerHTML = '';

        users.forEach(user => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${user.name}</td>
                <td>${user.age}</td>
                <td>${user.gender}</td>
                <td>${user.phone}</td>
                <td>${user.email}</td>
                <td>${user.address.city}</td>
                <td>${user.address.region}</td>
                <td>${user.address.country}</td>
                <td>${user.weather.temperature}</td>
                <td>${user.weather.condition}</td>
                <button class="BTN_EDIT BTN" data-id="${user._id}">Edit</button>
                <button class="BTN_DELETE BTN" data-id="${user._id}">Delete</button>
            `;

            TABLEBODY.appendChild(tr);
        });

        document.querySelectorAll('.BTN_EDIT').forEach(button => {
            button.addEventListener('click', handleEdit);
        });

        document.querySelectorAll('.BTN_DELETE').forEach(button => {
            button.addEventListener('click', handleDelete);
        });
    };

    async function fetchUsers() {
        try {
            const res = await fetch(`${BASEURL}/user`, {
                method: 'GET'
            });

            if (res.status !== 201) {
                console.log("Some error occured");
                alert("Some errored occured while fetching users");
                return;
            }

            const users = await res.json();
            populateTable(users);
        } catch (error) {
            console.error(error);
            alert('An error occurred while fetching users');
        }
    };


    fetchUsers();
});