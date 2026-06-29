# MealMate 🍔

MealMate is a modern, premium Smart Canteen Management System designed to streamline food ordering and counter payments for college campuses. It bridges the gap between students ordering food and the administration managing inventory and payments.

## Features ✨

### For Students:
- **Premium UI**: Beautiful, glassmorphism-inspired dark mode interface with smooth Framer Motion animations.
- **Smart Menu**: Browse categories (Hot Dishes, Cold Dishes, Desserts, etc.), view live stock, and add items to your cart.
- **QR / Token System**: Upon placing an order, students wait for admin approval. Once approved, a unique 6-character alphanumeric code is generated to show at the counter.
- **Real-time Order Status**: Track orders from Pending → Approved → Paid.

### For Administrators (Canteen Staff):
- **Live Dashboard**: View daily statistics, pending orders, and recently paid orders.
- **Inventory Management**: Add new meals with photos (Base64 optimized), update prices, manually adjust stock, and toggle menu visibility instantly.
- **Counter View**: A dedicated POS-like screen to enter a student's 6-character code, instantly fetch their cart, and mark the order as Paid, which automatically deducts the stock from the inventory.

## Tech Stack 💻
- **Frontend**: React.js, TailwindCSS, Framer Motion, Axios, React Hot Toast
- **Backend**: Node.js, Express.js, JSON Web Tokens (JWT) for Auth
- **Database**: MongoDB Atlas (Mongoose ODM)

## Getting Started 🚀

### Prerequisites
- Node.js installed on your machine
- A MongoDB cluster (or local instance)

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables. Ensure `config/default.json` has your MongoDB URI and JWT secret:
   ```json
   {
     "mongoURI": "your_mongodb_connection_string",
     "jwtSecret": "your_super_secret_key"
   }
   ```
4. Start the backend server:
   ```bash
   node index.js
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Default Admin Credentials
To access the Admin Panel, you can create an admin user directly in the database, or use the pre-configured script provided during development. Ensure the user document has `role: "admin"`.

---
*Developed for a smart campus experience.*
