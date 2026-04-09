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

const renderUserDetails = () => {
  if (!selectedUser) {
    detailSection.innerHTML = '';
    return;
  }

  detailSection.innerHTML = `
    <article class="detail-panel">
      <img
        src="${selectedUser.picture.large}"
        alt="${selectedUser.name.first} ${selectedUser.name.last}"
        class="user-avatar"
      />
      <h2>${selectedUser.name.first} ${selectedUser.name.last}</h2>
      <p><strong>Email:</strong> ${selectedUser.email}</p>
      <p><strong>Phone:</strong> ${selectedUser.phone}</p>
      <p><strong>Location:</strong> ${selectedUser.location.city}, ${selectedUser.location.country}</p>
    </article>
  `;
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

    if (selectedUser === user) {
      card.classList.add('active');
    }

    card.innerHTML = `
      <img 
        src='${user.picture.large}'
        alt='${user.name.first} ${user.name.last}'
        class='user-avatar'
      />
      <h3>${user.name.first} ${user.name.last}</h3>
      <p>${user.email}</p>
      <p>${user.location.city}, ${user.location.country}</p>
      <p>${user.phone}</p>
      <button class='view-details-btn' type='button'>View Details</button>
    `;

    const viewDetailsBtn = card.querySelector('.view-details-btn');

    viewDetailsBtn.addEventListener('click', () => {
      selectedUser = user;
      renderUsers();
      renderUserDetails();
    });

    usersGrid.appendChild(card);
  });
};

const fetchUsers = async () => {
  renderStatusMessage('Loading users...');

  try {
    const response = await fetch('https://randomuser.me/api/?results=12');

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

  if (selectedUser) {
    const stillVisible = filteredUsers.includes(selectedUser);

    if (!stillVisible) {
      selectedUser = null;
    }
  }

  renderUsers();
  renderUserDetails();
  updateStats();
});
