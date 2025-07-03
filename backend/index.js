const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// --- Used to create sample contacts ---
// Example: Uncomment and restart server to add sample contacts for testing
// db.run(
//   'INSERT OR IGNORE INTO contacts (email, full_name, department, phone, job_title) VALUES (?, ?, ?, ?, ?)',
//   ['sender@example.com', 'Alice Smith', 'Sales', '123-456-7890', 'Sales Manager']
// );
// db.run(
//   'INSERT OR IGNORE INTO contacts (email, full_name, department, phone, job_title) VALUES (?, ?, ?, ?, ?)',
//   ['boss@company.com', 'Bob Boss', 'Management', '555-555-5555', 'CEO']
// );
// ---------------------------------------------------------------

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expect: "Bearer <token>"

  if (!token) return res.status(401).json({ message: 'Missing token' });

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

app.get('/', (req, res) => {
  res.send('API is running!');
});

// Register endpoint
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword],
      function (err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({ message: 'User already exists' });
          }
          return res.status(500).json({ message: 'Database error' });
        }
        res.status(201).json({ message: 'User registered' });
      }
    );
  } catch (err) {
    res.status(500).json({ message: 'Error hashing password' });
  }
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    // Create JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );
    res.json({ token });
  });
});

// Get contact info for a given email (JWT-protected)
app.get('/contact/:email', authenticateToken, (req, res) => {
  const email = req.params.email;
  db.get('SELECT * FROM contacts WHERE email = ?', [email], (err, contact) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!contact) return res.status(404).json({ message: 'Contact not found' });

    // Only return relevant fields
    const { full_name, department, phone, job_title } = contact;
    res.json({ full_name, department, phone, job_title });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});