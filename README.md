# 🚀 Project Camp — Frontend

A full-stack project management application built to help teams organize projects, manage tasks, collaborate with members, and maintain shared notes — all in one clean workspace.

🔗 **Live Demo:** https://projectmanagement-omk.vercel.app/

🔗 **Backend Repository:** https://github.com/omk-collab/projectmanagement-backend

---

## ✨ Features

### 🔐 Authentication

- User registration and login
- JWT authentication with access and refresh tokens
- Email verification
- Forgot and reset password functionality
- Persistent user sessions
- Automatic token refresh

### 📁 Projects

- Create and manage multiple projects
- View project details
- Search projects
- Sort projects by name, members, or recent activity
- Role-based project access
- Admin, Project Admin, and Member roles

### ✅ Tasks & Subtasks

- Kanban-style task board
- To Do / In Progress / Done task statuses
- Assign tasks to team members
- Edit task titles
- Update task status
- Create and manage subtasks
- Track subtask completion and progress

### 👥 Team Collaboration

- Add members to projects using email
- Assign specific project roles
- Update member roles
- Remove members
- Admin-only member management

### 📝 Shared Notes

- Create project notes
- View shared notes
- Edit notes
- Delete notes
- Admin-controlled note management

### 🎨 User Experience

- Responsive interface
- Toast notifications
- Confirmation dialogs for destructive actions
- Loading spinners and skeleton states
- Search and sorting
- Clean and simple dashboard
- Mobile-friendly design

---

## 🛠 Tech Stack

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Axios
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Nodemailer

### Deployment

- Frontend — Vercel
- Backend — Render
- Database — MongoDB Atlas

---

## 📸 Screenshots

### 🏠 Landing Page

![Landing Page](./screenshots/Screenshot%202026-08-31%20223858.png)

### 📊 Dashboard

![Dashboard](./screenshots/Screenshot%202026-08-31%20225522.png)

### 📋 Task Board

![Task Board](./screenshots/Screenshot%202026-08-31%20230917.png)

---

## 📂 Project Structure

```text
src/
├── api/
│   ├── auth.api.js
│   ├── project.api.js
│   ├── task.api.js
│   └── note.api.js
│
├── components/
│   ├── auth/
│   ├── common/
│   ├── layout/
│   └── project/
│
├── context/
│   ├── AuthContext.jsx
│   └── ToastContext.jsx
│
├── pages/
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── ProjectDetails.jsx
│   ├── TaskDetails.jsx
│   └── Profile.jsx
│
├── App.jsx
└── main.jsx
