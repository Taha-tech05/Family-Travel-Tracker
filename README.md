# Family Travel Tracker - React + Node.js

This application has been converted from EJS templates to a React frontend while keeping the Node.js/Express backend with PostgreSQL.

## Project Structure

```
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── App.css        # Styles
│   │   └── main.jsx       # React entry point
│   └── package.json
│
├── index.js               # Node.js/Express backend (API server)
├── queries.sql            # Database schema
├── package.json           # Backend dependencies
└── public/                # Static assets (CSS, etc.)
```

## Setup Instructions

### 1. Database Setup (PostgreSQL)

Make sure PostgreSQL is installed and running. Then create the database and tables:

```bash
# Create database named 'world' if it doesn't exist
# Run the queries from queries.sql to create tables:
# - users
# - visited_countries  
# - countries (should already exist with country data)
```

### 2. Backend Setup

```bash
# Install backend dependencies
npm install

# The backend will run on http://localhost:3000
# Start the backend server
node index.js
```

### 3. Frontend Setup

```bash
# Navigate to client directory
cd client

# Install frontend dependencies
npm install

# Start the React development server (runs on http://localhost:5173)
npm run dev
```

## How It Works

### Backend (Node.js + Express + PostgreSQL)

The backend has been converted to a REST API:

- **GET `/api/data`** - Returns all countries, users, and current user info
- **POST `/api/add`** - Add a visited country for the current user
- **POST `/api/user`** - Switch to a different user
- **POST `/api/new`** - Create a new family member/user

### Frontend (React + Vite)

The React frontend communicates with the backend via axios HTTP requests:

- Displays an interactive world map (SVG)
- Shows user tabs to switch between family members
- Form to add countries visited
- Form to add new family members
- Countries are highlighted in the user's chosen color

## Key Changes from EJS Version

1. **Backend**: 
   - Removed EJS view engine
   - Added CORS middleware
   - Changed routes to return JSON instead of rendering views
   - Added proper error handling

2. **Frontend**:
   - Created React components to replace EJS templates
   - State management with React hooks (useState, useEffect)
   - API calls with axios
   - Same visual design and functionality

## Running Both Servers

You need to run both servers simultaneously:

**Terminal 1 - Backend:**
```bash
node index.js
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Then open http://localhost:5173 in your browser.

## Features

- ✅ Track countries visited by family members
- ✅ Multiple users with different colors
- ✅ Interactive world map
- ✅ Add new family members
- ✅ PostgreSQL database persistence
- ✅ Responsive design

## Technologies Used

**Backend:**
- Node.js
- Express.js
- PostgreSQL (pg)
- CORS

**Frontend:**
- React 18
- Vite
- Axios
- CSS3

## Notes

- Make sure PostgreSQL is running before starting the backend
- Update database credentials in `index.js` if needed
- The world map SVG contains all country paths - you may need to copy the complete SVG from the original `views/index.ejs` file to the React component for all countries to display properly
