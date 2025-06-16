```markdown
# 🐞 Bug Tracking and Project Management System

A full-stack, role-based web application for managing software bugs, project assignments, and developer-tester workflows. Built using **React.js** for the frontend and **Spring Boot** for the backend, the system supports Admins, Developers, and Testers with customized dashboards and secure authentication.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- Secure JWT-based login and registration
- Role-based access control: Admin, Tester, Developer
- Only Admins can register new users

### 🧑‍💼 Admin Dashboard
- Create and manage projects
- Assign projects to developers and testers
- Assign bugs to developers
- View and filter all bugs by status, priority, and project

### 🧪 Tester Dashboard
- View assigned projects
- Create bug reports
- View all reported bugs with their current statuses

### 👨‍💻 Developer Dashboard
- View assigned projects and bugs
- Update bug statuses (Assigned → In Progress → Resolved)
- Add resolution notes upon fixing bugs

### 📊 Bug Management
- Bug lifecycle: Open → Assigned → In Progress → Resolved
- Collapsible sections grouping bugs by status
- Filters: project, priority, status, and creation time (1 day, 7 days, month)
- Sorting: priority (high to low), bug ID (ascending)

---

## 🛠️ Tech Stack

| Layer    | Technology                    |
|----------|-------------------------------|
| Frontend | React.js, Tailwind CSS, Axios |
| Backend  | Spring Boot, Spring Security  |
| Auth     | JWT (JSON Web Tokens)         |
| Database | MySQL                         |
| Tools    | Postman, Git, Maven           |

```

## 📁 Folder Structure (High-Level)

````

📦 bug-tracker
├── backend/
│   ├── controller/
│   ├── service/
│   ├── entity/
│   ├── repository/
│   └── security/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.js
└── README.md

````

---

## ⚙️ Setup Instructions

### 📌 Prerequisites
- Node.js (v16+)
- Java 17
- MySQL
- Maven

---

### 🧩 Backend Setup (Spring Boot)

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/bug-tracker.git
   cd bug-tracker/backend
   


2. Configure `application.properties`:

   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/bug_tracker
   spring.datasource.username=your_mysql_username
   spring.datasource.password=your_mysql_password
   jwt.secret=your_jwt_secret
   ```

3. Run the backend:

   ```bash
   mvn spring-boot:run
   ```

---

### 🖥️ Frontend Setup (React.js)

1. Navigate to the frontend directory:

   ```bash
   cd ../frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the React app:

   ```bash
   npm start
   ```

---

## 🧪 Demo Users (Optional)

```
Admin:
Username: admin
Password: admin123

Tester:
Username: tester
Password: tester123

Developer:
Username: developer
Password: developer123
```

> Update credentials based on your setup or initial seed data.

---

## 📷 Screenshots

*Add relevant screenshots here:*

## Home page
(https://files.oaiusercontent.com/file-J8YfkxzNHQbYtatVadDFas?se=2025-06-16T12%3A43%3A00Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D299%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D1db101f3-fbaa-42a4-85de-14b0550ae845.png&sig=vnm/7tC4XRY4M0kKeSI/arVrLKM6RROWc8nBoXTfNi4%3D)

## Admin Dashboard
![Admin Dashboard](screenshots/dashboard.png)

## Tester View
![Tester View](screenshots/tester-view.png)

## Developer Bug Table
![Developer Bug Table](screenshots/dev-bugs.png)


---

## 🔮 Future Enhancements

* Email notifications for bug assignments
* Role activity logs
* Export bug reports (CSV/PDF)
* Unit and integration testing

---

## 👨‍💻 Author

**Utsav Gavli**
[LinkedIn](https://www.linkedin.com/) • [GitHub](https://github.com/your-username) • [Portfolio](https://your-portfolio.com)

---

## 📄 License

This project is licensed under the MIT License.

```


