// JS logic to be implemented here// main.js

const loginSection = document.getElementById('login-section');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');

const outlookSection = document.getElementById('outlook-section');
const senderEmail = document.getElementById('sender-email');
const fetchContactBtn = document.getElementById('fetch-contact');
const contactInfo = document.getElementById('contact-info');
const contactError = document.getElementById('contact-error');
const logoutBtn = document.getElementById('logout');

// Simulated sender email (as per the brief)
const SIMULATED_SENDER = 'sender@example.com';

// Show/hide sections based on login state
function showOutlookSection() {
  loginSection.style.display = 'none';
  outlookSection.style.display = 'block';
  senderEmail.textContent = SIMULATED_SENDER;
}

function showLoginSection() {
  loginSection.style.display = 'block';
  outlookSection.style.display = 'none';
  loginForm.reset();
  localStorage.removeItem('jwt');
}

// Handle login form submit
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('http://localhost:4000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok && data.token) {
      localStorage.setItem('jwt', data.token);
      showOutlookSection();
    } else {
      loginError.textContent = data.message || 'Login failed';
    }
  } catch (err) {
    loginError.textContent = 'Network error';
  }
});

// Handle logout
logoutBtn.addEventListener('click', showLoginSection);

// On page load, check if JWT exists
if (localStorage.getItem('jwt')) {
  showOutlookSection();
} else {
  showLoginSection();
}

let contactVisible = false;

fetchContactBtn.addEventListener('click', async () => {
  if (contactVisible) {
    contactInfo.innerHTML = '';
    contactError.textContent = '';
    fetchContactBtn.textContent = 'Show Contact Info';
    contactVisible = false;
    return;
  }

  contactInfo.textContent = '';
  contactError.textContent = '';

  const jwt = localStorage.getItem('jwt');
  if (!jwt) {
    contactError.textContent = 'You are not logged in.';
    showLoginSection();
    return;
  }

  try {
    const res = await fetch(`http://localhost:4000/contact/${SIMULATED_SENDER}`, {
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      contactInfo.innerHTML = `
        <div class="contact-card">
          <div class="contact-row"><span class="label">Name:</span> <span>${data.full_name}</span></div>
          <div class="contact-row"><span class="label">Department:</span> <span>${data.department}</span></div>
          <div class="contact-row"><span class="label">Phone:</span> <span>${data.phone}</span></div>
          <div class="contact-row"><span class="label">Job Title:</span> <span>${data.job_title}</span></div>
        </div>
      `;
      fetchContactBtn.textContent = 'Hide Contact Info';
      contactVisible = true;
    } else {
      contactError.textContent = data.message || 'Failed to fetch contact info';
    }
  } catch (err) {
    contactError.textContent = 'Network error';
  }
});