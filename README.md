# 🔐 Password Manager (Full Stack + PWA)

A secure **Password Manager application** built using **Flask (Python)** for the backend and **HTML, CSS, JavaScript** for the frontend.  
The application supports **encrypted password storage**, **CRUD operations**, and can be installed as a **mobile app using PWA technology**.

---

## 🚀 Features

- 🔐 Password encryption using **Fernet (cryptography)**
- ➕ Add new passwords
- 👀 View stored passwords
- 📋 Copy passwords to clipboard
- ✏️ Edit existing passwords
- ❌ Delete passwords
- 🔍 Search passwords (basic)
- 📱 Installable as a **Mobile App (PWA)**

---

## 🧠 How Security Works

- Passwords are **never stored in plain text**
- Before saving to the database, passwords are **encrypted**
- When displaying, they are **decrypted only in memory**
- Encryption key is stored locally and **excluded from GitHub**

---

## 🛠️ Tech Stack

### Backend
- Python
- Flask
- Flask-CORS
- SQLite
- Cryptography (Fernet)
- Gunicorn (for deployment)

### Frontend
- HTML
- CSS
- JavaScri


password-manager/
│
├── backend/
│ ├── app.py
│ ├── database.py
│ ├── encryption.py
│ ├── requirements.txt
│
├── frontend/
│ ├── index.html
│ ├── style.css
│ ├── script.js
│ ├── manifest.json
│ ├── service-worker.js
│
├── .gitignore
├── README.md


---

## ▶️ Run Locally

### 1️⃣ Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
