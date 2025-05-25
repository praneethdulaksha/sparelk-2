# 🚗 SpareLK - Vehicle Spare Parts Marketplace

**SpareLK** is a web-based platform that connects **buyers and sellers of vehicle spare parts** across Sri Lanka. Built on the MERN stack with TypeScript, SpareLK offers a modern, reliable, and user-friendly way to buy and sell new or used auto parts online.

---

## 📦 Features

- 🔍 Advanced product filtering (category, brand, condition, price)
- 🛒 Cart and secure checkout flow
- 👨‍🔧 Buyer & Seller user roles
- 🏪 Store creation and management
- ✉️ Email verification on registration
- ⭐ Reviews with seller feedback
- 📄 Seller document (BR PDF) upload
- 📱 Responsive design for mobile and desktop

---

## 🧑‍💼 About the Business

SpareLK simplifies the spare part search and purchase process by bringing verified sellers and genuine buyers onto one platform. The aim is to:

- Reduce time wasted in physical store searches
- Promote transparency and trust in used part sales
- Support mechanics, garages, and vehicle owners in finding exact-fit parts

---

## 🛠 Tech Stack

| Layer       | Tools / Libraries                         |
|-------------|-------------------------------------------|
| Frontend    | React + TypeScript, Tailwind CSS, Redux |
| Backend     | Node.js, Express.js                       |
| Database    | MongoDB Atlas                             |
| Auth        | JWT + Email Verification                  |
| File Upload | Multer                                    |
| 3D Viewer   | React Three Fiber (optional)              |

---

## 🚀 How to Run Locally

### 🔧 Prerequisites

- Node.js v18 or v20
- MongoDB Atlas URI
- npm

### 📥 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/sparelk-2.git
   cd sparelk-2


2. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Create `.env` in /server:**
   ```ini
   MONGO_URI=<your_mongodb_uri>
   JWT_SECRET=your_jwt_secret
   EMAIL_ADDRESS=your_email_address
   EMAIL_APP_PASSWORD=your_email_app_password
   ```

4. **Install client dependencies:**
   ```bash
   cd ../client
   npm install
   ```

5. **Run the project:**
   - **Backend:**
     ```bash
     cd server
     npm run dev
     ```

   - **Frontend:**
     ```bash
     cd ../client
     npm run dev
     ```

6. **Visit the app:**
   ```url
   http://localhost:5173
   ```

---

## 📂 Folder Structure

```bash
sparelk/
├── client/       # Frontend (React)
├── server/       # Backend (Express)
│   └── assets/   # Uploaded images and BR PDFs
└── README.md
```

---

## 📜 License

This project is licensed under the MIT License.
