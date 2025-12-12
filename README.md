🚀 AI-Powered RFP Management System

<p align="center"> <img src="https://img.shields.io/badge/Frontend-React%20(Vite)-61DAFB?logo=react&logoColor=white" /> <img src="https://img.shields.io/badge/Backend-Node.js-43853D?logo=node.js&logoColor=white" /> <img src="https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white" /> <img src="https://img.shields.io/badge/AI-OpenAI%20GPT-412991?logo=openai&logoColor=white" /> <img src="https://img.shields.io/badge/Email-SMTP/IMAP-orange" /> <img src="https://img.shields.io/badge/Architecture-Full%20Stack-blueviolet" /> <img src="https://img.shields.io/badge/Status-Submission%20Ready-success" /> </p>
📌 Overview

This project is an AI-powered procurement automation system that allows a procurement manager to:
Create RFPs using natural language
Manage vendors
Email RFPs to selected vendors
Receive vendor proposals by email
Automatically extract proposal details using AI
Compare proposals and get an AI-generated recommendation
A complete end-to-end workflow automation system.

✨ Features
📝 1. Create RFP from Natural Language
AI converts messy human text into structured JSON.

🧑‍💼 2. Vendor Management
Add, edit, store vendor profiles.

✉️ 3. Send RFP via Email
Email RFP details to selected vendors.

📥 4. Receive Vendor Proposals
Vendor emails are auto-parsed using AI.

📊 5. Compare Proposals
Scores vendors based on: price,delivery,warranty,completeness,AI recommendation

🎯 6. Wizard Onboarding
Step-by-step onboarding wizard.

📈 7. Dashboard
Shows stats, latest RFPs, shortcuts.

🧠 AI Usage
✔ Parse RFP natural text

→ Convert input into structured JSON

✔ Parse vendor email

→ Extract prices, totals, delivery days, warranty

✔ Compare vendors

→ Score, rank, and generate recommendation

- 🛠 Tech Stack
  Frontend
  React (Vite),Axios,Custom CSS

Backend
Node.js,Express.js,Database,MongoDB + Mongoose,AI,OpenAI GPT Models,Email,Nodemailer (SMTP),IMAP Email Receiver,

📁 Project Structure
backend/
src/>
controllers/
models/
routes/
services/
server.js

frontend/
src/
pages/
components/
styles/
api.js
README.md

⚙️ Installation
1️⃣ Backend Setup
cd backend
npm install

Create .env:

PORT=4000
MONGO_URI=your_mongo_uri
OPENAI_API_KEY=your_openai_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

Run backend:

npm run dev

2️⃣ Frontend Setup
cd frontend
npm install
npm run dev

Frontend → http://localhost:5173

Backend → http://localhost:4000

🔌 API Endpoints
RFP
POST /api/rfps
GET /api/rfps
GET /api/rfps/:id/details
GET /api/rfps/:id/compare

Vendors
POST /api/vendors
GET /api/vendors

Send RFP
POST /api/send-rfp

Email Receive
POST /api/email/receive

🧪 Seed Script

Use seed.js to generate sample: RFP,Vendors,3 proposals

Run: node seed.js

🚀 Future Improvements

PDF parsing
Multi-user accounts
Vendor login portal
Analytics dashboard
Proposal history timeline

🧠 Tools Used

Tool Purpose
ChatGPT Architecture + debugging help
VS Code Development
MongoDB Compass DB viewing
React DevTools Frontend debugging
Postman API testing

🏁 Conclusion

This project demonstrates:
AI integration
Email automation
Backend architecture
Database modeling
Frontend workflows
Full RFP lifecycle automation
