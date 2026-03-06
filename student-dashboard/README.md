# Academica 

A full-stack web app to manage student records — built with React.js, Node.js, Express.js, and MySQL.

---

## Features

- Add, update, view, and delete student records
- Responsive UI across all devices
- REST API with MySQL for structured data storage

---

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MySQL

---

## Setup

```bash
git clone https://github.com/Mahagola/Academica.git
cd Academica
npm install
node server.js
```

Configure your MySQL credentials in `server.js`, then import the schema:

```bash
mysql -u root -p < student-crux.sql
```

Open `http://localhost:3000` in your browser.