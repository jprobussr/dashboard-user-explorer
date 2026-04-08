const searchInput = document.getElementById('searchInput');
const usersGrid = document.getElementById('usersGrid');
const totalUsers = document.getElementById('totalUsers');
const visibleUsers = document.getElementById('visibleUsers');
const detailSection = document.getElementById('detailSection');

let users = [];
let filteredUsers = [];
let selectedUser = null;

const filterUsers = (searchTerm) => {
  const normalizedTerm = searchTerm.toLowerCase().trim();

  filteredUsers = users.filter((user) => {
    const fullName = `${user.name.first} ${user.name.last}`.toLowerCase();
    const email = user.email.toLowerCase();

    return fullName.includes(normalizedTerm) || email.includes(normalizedTerm);
  });
};

const renderStatusMessage = (message) => {
  usersGrid.innerHTML = `
    <p class='status-message'>${message}</p>
  `;
};

const updateStats = () => {
  totalUsers.textContent = users.length;
  visibleUsers.textContent = filteredUsers.length;
};

const renderUsers = () => {
  usersGrid.innerHTML = '';

  if (filteredUsers.length === 0) {
    renderStatusMessage('No users found.');
    return;
  }

  filteredUsers.forEach((user) => {
    const card = document.createElement('article');
    card.classList.add('user-card');

    card.innerHTML = `
      <h3>${user.name.first} ${user.name.last}</h3>
      <p>${user.email}</p>
    `;

    usersGrid.appendChild(card);
  });
};

const fetchUsers = async () => {
  renderStatusMessage('Loading users...');

  try {
    const response = await fetch('https://randomuser.me/api/?results=100');

    if (!response.ok) {
      throw new Error('Something went wrong while fetching users.');
    }

    const data = await response.json();

    users = data.results;
    filteredUsers = data.results;

    renderUsers();
    updateStats();
  } catch (error) {
    renderStatusMessage('Unable to load users right now.');
    console.error(error);
  }
};

fetchUsers();

searchInput.addEventListener('input', (event) => {
  const searchTerm = event.target.value;

  filterUsers(searchTerm);
  renderUsers();
  updateStats();
});
