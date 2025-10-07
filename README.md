
# MERN Agent Distributor — Project

This document contains a complete project scaffold for the MERN Stack application requested: Admin login, agent creation/management, CSV upload and distribution among 5 agents, and display of distributed lists.

It uses:

* MongoDB (Mongoose)

* Express.js + Node.js backend

* React.js frontend (create-react-app)

* JWT for authentication

* Multer + csv-parse / xlsx for CSV/XLSX upload


## 📂 Project structure

mern-agent-distributor/\
├ backend/               # Node.js + Express backend \
│   ├── package.json \
│   ├── .env.example       # Example environment variables  \
│   ├── server.js          # App entry point \
│   ├── config/            # Database config \
│   │  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; └── db.js \
│   ├── models/            # Mongoose models \
│   │ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  ├── User.js \
│   │ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  ├── Agent.js \
│   │ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  └── Item.js \
│   ├── routes/            # Express routes \
│   │  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ├── auth.js \
│   │ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  ├── agents.js \
│   │  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; └── upload.js \
│   ├── middleware/        # Authentication middleware \
│   │ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  └── auth.js \
│   └── utils/             # Utility functions \
│      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; └── distribute.js \
│ \
├ frontend/              # React frontend \
│   ├── package.json \
│   ├── README.md \
│   └── src/ \
│     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  ├── index.js \
│     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  ├── App.js \
│     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  ├── api.js         # Axios API config \
│      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ├── components/    # UI Components \
│     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  │  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ├── Login.js \
│      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; │  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ├── Dashboard.js \
│      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; │  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ├── Agents.js \
│      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; │  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ├── UploadCSV.js \
│      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; │  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; └── AgentListView.js \
│     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  └── main.css \
│ \
└── README.md              # Project documentation 


## ⚙️ Setup Instructions

#### 1️⃣ Clone Repo

```bash
git clone https://github.com/santhosh-mce/mern-agent-distributor.git
cd mern-agent-distributor
```


#### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

##### Create a .env file (see .env.example):

```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```
##### Run backend:

```bash
npm run dev
```

3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```



## 📌 Usage Workflow

* Admin logs in securely

* Admin creates and manages agents

* Admin uploads CSV/XLSX file

* Records are distributed evenly across 5 agents

* Dashboard displays distributed lists


## ✅ Example CSV Format

```bash
FirstName,Phone,Notes
Alice,+911234567890,Important client
Bob,+919876543210,Follow up next week
Charlie,+911122334455,VIP
```