# Outlook Add-in: Contact Enrichment Solution

## Overview

This project is a simulated Outlook add-in that enriches the email reading experience by displaying additional contact information for the sender. It features:
- A secure backend API (Node.js, Express, SQLite) with JWT authentication
- A frontend web UI simulating the add-in experience
- Dockerized services for easy setup and deployment

---

## Features

- **User Authentication:** Register and login with email and password, with secure password hashing (bcrypt).
- **JWT Security:** Backend issues JWT tokens on login; protected endpoints require a valid token.
- **Contact Enrichment:** Fetches and displays sender’s full name, department, phone, and job title.
- **Simulated Outlook Context:** UI displays a fixed sender email for demonstration.
- **Fully Dockerized:** One command to run the entire stack.
- **Sample Data:** Pre-populated contacts for testing.

---

## Tech Stack

- **Backend:** Node.js, Express, SQLite, JWT, bcrypt
- **Frontend:** HTML, CSS, JavaScript
- **Containerization:** Docker, Docker Compose
- **Database:** SQLite (file-based, easy to set up)

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)
- (Optional) [DB Browser for SQLite](https://sqlitebrowser.org/) for viewing the database

---

## Setup Instructions

### 1. **Clone the Repository**

```bash
git clone https://github.com/ChrissieDk/eKomi-assessment.git
cd eKomi
```

### 2. **Set Up Environment Variables**

Create a `.env` file in the project root (same folder as `docker-compose.yml`) with:

```
JWT_SECRET=your_super_secret_key
```

> **Note:**  
> This secret is required for authentication to work.  
> If you do not set it, the backend will use a default value (`secret`), but for security and consistency, always set your own.

### 3. **Build and Run with Docker Compose**

```bash
docker-compose up --build
```

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:4000](http://localhost:4000)

---

## Usage

### **Register a User**

1. Use Postman to send a POST request to:
   ```
   POST http://localhost:4000/register
   Body: { "email": "test@example.com", "password": "password123" }
   ```
2. You only need to register once per user.

### **Login via the Frontend**

1. Go to [http://localhost:3000](http://localhost:3000)
2. Enter your registered email and password.
3. On successful login, the add-in simulation UI will appear.

### **Fetch Contact Info**

- Click "Show Contact Info" to fetch and display details for the simulated sender (`sender@example.com`).
- Click "Hide Contact Info" to hide the details.

---

## Simulated Outlook Context

- The sender email is hardcoded as `sender@example.com` to simulate the Outlook environment, as per the assessment brief.

---

## Database

- The SQLite database (`database.sqlite`) is created automatically in the backend container.
- **Sample contacts** are pre-populated for demonstration:
  - `sender@example.com` (Alice Smith)
  - `boss@company.com` (Bob Boss)
- You can view or edit the database using [DB Browser for SQLite](https://sqlitebrowser.org/).

---

## Project Structure

```
.
├── backend/
│   ├── index.js
│   ├── db.js
│   ├── Dockerfile
│   ├── .dockerignore
│   └── (other backend files)
├── frontend/
│   ├── index.html
│   ├── main.js
│   ├── styles.css
│   └── Dockerfile
├── docker-compose.yml
├── .env
└── README.md
```

---

## Environment Variables

- **JWT_SECRET** (required): Secret key for signing JWT tokens.
  - Set in the root `.env` file for Docker Compose.
  - Example: `JWT_SECRET=my_super_secret_key_123`

---

## Troubleshooting

- **Backend fails with `invalid ELF header`:**
  - Make sure you do NOT copy your local `node_modules` into the Docker image. Use the provided `.dockerignore`.
- **Cannot login/register:**  
  - Ensure your `.env` file is present and has a `JWT_SECRET`.
  - Make sure both containers are running (`docker-compose ps`).
- **Frontend cannot reach backend:**  
  - Both must be running via Docker Compose for networking to work.
- **Database not persisting:**  
  - The `database.sqlite` file is mounted as a volume in Docker Compose for persistence.

---

## Office Add-in Manifest

- See `manifest.xml` in the project root for a sample Office Add-in manifest (not used in this simulation, but included as per the brief).

---

## Research & References

- [Express.js Documentation](https://expressjs.com/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [jsonwebtoken (JWT) Docs](https://github.com/auth0/node-jsonwebtoken)
- [bcrypt Docs](https://github.com/kelektiv/node.bcrypt.js)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [DB Browser for SQLite](https://sqlitebrowser.org/)

---

## Development Notes

- All sensitive files (`.env`, `database.sqlite`, `node_modules`) are excluded from version control.
- The backend and frontend are fully decoupled and can be run independently if needed.
- The UI is intentionally simple and clean for demonstration and assessment purposes.

---

## Challenges Faced

- I have not worked with a Node.js Express server in a while, so I had to read up on how to implement it and refresh my knowledge.
- I do not regularly use Docker, but was able to find base Docker setups in the official docs and through Google searches to satisfy the requirements. This helped me accomplish the Dockerfiles and Compose setup.
- I had to install a GUI (DB Browser for SQLite) to check and verify my database data, which was a new tool for me.

---

## Author

- [Christiaan de Kock]
- [0767558992]

---


**If you have any issues running the project, please don't hesitate to contact me directly.**
