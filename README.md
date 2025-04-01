# 🛡️ AirSecure

**AirSecure** is a secure web application built with **Next.js** and **PostgreSQL**, designed to provide robust authentication and user management. It features a clean, scalable architecture and a responsive UI built with MUI.

---

## 🚀 Features

- 🔐 JWT-based authentication with HttpOnly cookies
- 🧭 Protected routes using middleware
- 🖼️ Clean UI with MUI and Emotion styling
- 📄 Custom login and signup forms
- 👋 Personalized greeting with user name after login
- ⛔ Logout functionality via API
- 🧩 Modular and scalable code structure

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, MUI (Material UI), Emotion
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL (local setup)
- **Authentication:** JWT (JSON Web Tokens), HttpOnly cookies

---


# Installation 👨🏻‍💻

> To setup a local application, follow the instructions

1. Install all packages

```
npm i
```

2. Modify the DB connection in .env to your db

```
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/your_db_name
```

3. Run DB migrate

```
npx prisma migrate dev
```

4. Run Dev server

```
npm run dev
```
