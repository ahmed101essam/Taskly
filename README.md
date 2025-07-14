# 🧠 Task Management App Documentation

A full-stack project management API built using **Node.js**, **Express**, **Prisma**, and **PostgreSQL**, enhanced with **Socket.IO** for real-time notifications.

---

## 📁 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (via Prisma ORM)
- **Authentication:** JWT (JSON Web Token)
- **File Upload:** Multer + Cloudinary
- **Real-Time:** Socket.IO (notifications)
- **Hosting Ready:** Environment-agnostic (e.g., Railway, Render)

---

## 📦 Features

### 🧑‍💻 Authentication

- Signup (with optional photo upload)
- Email verification
- Login / JWT Auth
- User profile editing (photo, name)

### 🧑‍🤝‍🧑 Projects

- Create / Edit / Delete projects (with photo upload)
- Invite members to projects
- Accept/Reject project invitations
- Transfer project ownership
- Member role management (MANAGER / SUPERVISOR / MEMBER)
- Leave projects
- Access control enforced via middleware

### ✅ Tasks

- Add / Edit / Delete tasks
- Task status: ASSIGNED, INPROGRESS, FINISHED, CLOSED
- Assign tasks to members
- Role-based access to modify/delete tasks
- Mark tasks as done (only by assigned user)

### 💬 Comments

- Add / Edit / Delete comments on tasks
- Nested under tasks

### 🔔 Notifications

- Triggered on task creation, deletion, comment addition, etc.
- Real-time delivery via **Socket.IO**
- Supports: TASKUPDATE, TASKASSIGNMENT, TASKREMOVAL, COMMENT, INVITATION, etc.
- Endpoint to mark all as read

### 🔍 Search

- Search users by username or email (case insensitive)

---

## ⚡ Real-time System (Socket.IO)

### Connection Flow

- Clients connect via token in query params.
- Token is verified using JWT.
- User is set as `online: true` in DB.
- Notifications are fetched and sent on connection.

### Real-time Notifications

```js
socket.emit("notification", newNotification);
```

- On disconnect, user is marked `online: false`.

### Benefits

- Users get task updates, comments, and invites instantly.

---

## 🔐 Role & Access Control

- Middleware enforces:
  - Only MANAGERs can delete tasks or projects
  - Only assigned user can mark a task done
  - Only project members can view/access project-related routes

---

## 🧱 Indexing

Indexes are added automatically by Prisma on:

- `user.email`, `user.username` (for fast lookup)
- `verification_token` (unique)
- Composite primary key in `project_member` for quick access

Custom indexing was not manually configured, but Prisma + PostgreSQL handle optimized queries well.

---

## 💡 Future Improvements

- Add email notifications (e.g., task due reminders)
- Add support for task labels and categories
- Add file attachments per task
- Add project-level activity logs
- Implement pagination in task list

---

## 📂 Folder Structure (Simplified)

```
├── controllers/
│   ├── authController.js
│   ├── projectsController.js
│   ├── taskController.js
│   ├── usersController.js
│   └── commentsController.js
├── routes/
│   ├── userRoutes.js
│   ├── projectRoutes.js
│   └── taskRoutes.js
├── utils/
│   ├── appError.js
│   ├── catchAsync.js
│   ├── database.js
│   ├── multer.js
│   └── imageCloud.js
├── socket.js
├── app.js
├── server.js
└── prisma/schema.prisma
```

---

## 📄 Prisma Models Summary

### User

```prisma
model User {
  id          Int @id @default(autoincrement())
  username    String @unique
  email       String @unique
  password    String
  role        Role @default(USER)
  verified    Boolean @default(false)
  online      Boolean @default(false)
  ...
}
```

### Project & Member

```prisma
model Project {
  id         Int @id @default(autoincrement())
  name       String
  managerId  Int
  tasks      Task[]
  members    ProjectMember[]
}

model ProjectMember {
  userId     Int
  projectId  Int
  role       MemberRole
  @@id([userId, projectId])
}
```

### Task

```prisma
model Task {
  id          Int @id @default(autoincrement())
  title       String
  description String?
  status      TaskStatus
  priority    Priority
  assignedTo  Int
  createdBy   Int
  projectId   Int
  ...
}
```

---

## 🚀 Run Instructions

1. `npm install`
2. Set up `.env` with `DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_*`
3. `npx prisma migrate dev`
4. `npm run dev`

---

## 👨‍💻 Author

Built by **Ahmed Shehab**
