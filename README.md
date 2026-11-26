# BlueAttend — Smart Bluetooth-Based College Attendance System

**Smart Attendance. Verified Presence.**

## Stack
- **Frontend:** React + Vite + Tailwind CSS + React Router + Recharts + Socket.io client
- **Backend:** Node.js + Express + MongoDB + Mongoose + JWT + Socket.io
- **BLE:** Web Bluetooth API (student side). Faculty-side broadcasting requires a dedicated beacon or the future Android companion app.

## Setup

### 1. Backend
```bash
cd backend
cp .env.example .env
npm install
npm run seed        # creates demo data
npm run dev         # http://localhost:5000