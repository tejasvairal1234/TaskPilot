# TaskPilot 🚀

TaskPilot is a modern task and project management application designed to organize workflows and streamline productivity.

---

## 📁 Project Structure

```text
TaskPilot/
├── backend/          # Node.js & Express REST API with MongoDB
├── client/           # Frontend client application
├── .gitignore        # Git ignore configuration
└── README.md         # Project documentation
```

---

## 🛠️ Tech Stack

- **Backend**: [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/), [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Authentication & Security**: [JSON Web Tokens (JWT)](https://jwt.io/), [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- **Utilities**: [dotenv](https://github.com/motdotla/dotenv), [Nodemailer](https://nodemailer.com/), [cors](https://github.com/expressjs/cors)
- **Frontend**: Client workspace (React / Vite)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local or MongoDB Atlas instance)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)

---

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in `backend/` and configure your environment variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the server:
   - **Development mode (with nodemon):**
     ```bash
     npm start
     ```
   - **Standard mode:**
     ```bash
     npm run dev
     ```

The backend server will run on `http://localhost:5000` by default.

---

### Client Setup

1. Navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies & start the dev server (once client is initialized):
   ```bash
   npm install
   npm run dev
   ```

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
