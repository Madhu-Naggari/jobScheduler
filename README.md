# 🚀 Job Scheduler & Automation System

A **production-inspired job scheduling backend system** that allows authenticated users to create, run, track, and manage background jobs with a real execution lifecycle.

This project simulates how **real-world background processing systems** work (emails, reports, async workflows, automation tasks).

---

## 🧠 Why This Project?

Most modern applications rely on background jobs for:
- Sending emails
- Running async workflows
- Data processing
- Automation & integrations

This project demonstrates **real backend engineering concepts**, not just CRUD:
- Authentication & authorization
- Job lifecycle management
- Background workers
- Database relationships
- Clean backend architecture

---

## ✨ Features

### 🔐 Authentication
- User registration & login
- JWT-based authentication
- Protected routes for job operations

### 🧾 Job Management
- Create jobs with:
  - Task name
  - Priority (`low | medium | high`)
  - Payload (JSON data)
- Each job belongs to a specific user
- Persistent storage using MySQL

### ⚙️ Job Execution Lifecycle
- Run jobs manually
- Status flow:
- pending → running → completed
- Background execution simulated using a worker
- `completedAt` timestamp recorded on completion

### 🔍 Filtering & Querying
- Filter jobs by:
- Status
- Priority
- Query-parameter based filtering API

### 🧵 Worker-Based Architecture
- Dedicated worker layer for job execution
- Keeps controllers clean and focused
- Easily extendable to real job queues (BullMQ / RabbitMQ)

---

## 🏗️ Tech Stack

### Backend
- Node.js
- Express.js
- MySQL
- JWT (Authentication)
- bcrypt (Password hashing)

---

## 📁 Project Structure
backend/
├── src/
│   ├── controllers/   # Request handling logic
│   ├── routes/        # API route definitions
│   ├── services/      # Database & business logic
│   ├── workers/       # Background job execution
│   ├── middleware/    # Authentication middleware
│   ├── db/            # MySQL connection & setup
│   └── app.js         # Server entry point
---

## 🗄️ Database Schema

### Users Table
```sql
users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(150) UNIQUE,
  password VARCHAR(255),
  createdAt TIMESTAMP
)
jobs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  taskName VARCHAR(255),
  payload TEXT,
  priority VARCHAR(50),
  status VARCHAR(50),
  createdAt TIMESTAMP,
  completedAt TIMESTAMP,
  userId INT,
  FOREIGN KEY (userId) REFERENCES users(id)
)

### 🔐 Authentication APIs

| Method | Endpoint   | Description              |
|--------|------------|--------------------------|
| POST   | /register  | Register a new user      |
| POST   | /login     | Login and get JWT token  |

### 🧾 Job APIs

| Method | Endpoint     | Description                     |
|--------|--------------|---------------------------------|
| POST   | /jobs        | Create a new job                |
| POST   | /run-job/:id | Run a job                       |
| GET    | /jobs        | Get all jobs                    |
| GET    | /jobs/:id    | Get job details by ID           |
| GET    | /filter      | Filter jobs by status/priority  |

### 🔄 Job Execution Flow

Create Job → pending
Run Job → running
Job Finished → completed

### 🧪 Run Project Locally

### 1️⃣ Clone the repository

git clone (https://github.com/Madhu-Naggari/jobScheduler.git)
cd job-scheduler

### 2️⃣ Install dependencies

npm install

### 3️⃣ Setup environment variables
create .env file

MY_TOKEN=your_jwt_secret

### 4️⃣ Create MySQL database

CREATE DATABASE jobSchedular;

### 5️⃣ Start the server

npm start

Server runs on:
http://localhost:3000


---

## 🎨 Frontend (Dashboard UI)

The frontend provides an intuitive dashboard to manage background jobs visually.  
It communicates with the backend APIs and reflects real-time job status changes.

---

## ✨ Frontend Features

- User authentication (Login / Register)
- Create new jobs using a form
- View all jobs in a table
- Filter jobs by:
  - Status (`pending | running | completed`)
  - Priority (`low | medium | high`)
- Run jobs with a single click
- Live status updates:
pending → running → completed

- View detailed job information including payload & timestamps

---

## 🧰 Frontend Tech Stack

- Next.js
- Tailwind CSS
- Fetch API
- JWT-based authentication
- Responsive UI

---

## 🖥️ Pages & Components

- **Auth Pages**
- Login
- Register

- **Dashboard**
- Jobs table
- Status & priority filters
- Run Job button

- **Job Detail Page**
- Task name
- Priority
- Status
- Payload (formatted JSON)
- Created & completed timestamps

---

## 🔄 Frontend → Backend Interaction

- Login → receives JWT token
- Token stored securely (cookies)
- Token sent in headers for protected routes:
Authorization: Bearer 

- Frontend polls backend to reflect job status updates

---

## 📡 API Usage (Frontend Perspective)

### Authentication
- POST `/register`
- POST `/login`

### Jobs
- POST `/jobs`
- POST `/run-job/:id`
- GET `/jobs`
- GET `/jobs?status=completed&priority=low`
- GET `/jobs/:id`

---

## ▶️ Frontend Run Flow

1. User logs in
2. Creates a new job
3. Job appears as `pending`
4. User clicks **Run**
5. Status updates:
pending → running → completed


6. UI updates automatically

---

## 🚀 Running Frontend Locally

```bash
npm install
npm run dev





