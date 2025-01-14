# 🎓 College Compus
  
  *Your Academic Compass in the Campus* 
  
[![Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=websocket&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![GROQ](https://img.shields.io/badge/GROQ-F06835?style=for-the-badge&logo=sanity&logoColor=white)](https://www.sanity.io/docs/groq)
[![Qdrant](https://img.shields.io/badge/Qdrant-E94D33?style=for-the-badge&logo=qdrant&logoColor=white)](https://qdrant.tech/)
[![Next.js 15](https://img.shields.io/badge/Next.js%2015-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-7EBC6F?style=for-the-badge&logo=openstreetmap&logoColor=white)](https://www.openstreetmap.org/)
[![LiveKit](https://img.shields.io/badge/LiveKit-4537DE?style=for-the-badge&logo=livekit&logoColor=white)](https://livekit.io/)

</div>

## 🌟 Overview

College Compus is your all-in-one college companion, developed for the ACM Ideathon at Punjab Engineering College. Our platform revolutionizes campus life by integrating academic management, social connections, and real-time location services into a seamless experience.

### 🏆 Ideathon Project
- **Event**: ACM Ideathon 2024
- **Institution**: Punjab Engineering College
- **Team Members**: 
  - Vaibhav Verma
  - Mrinal Gaur
  - Antriksh Gupta
  - Prajanya Sharma

## ✨ Features

### 📚 Academic Management
- **Grade Tracking**: Monitor and analyze academic performance
- **Online Classes**: Virtual learning environment with interactive whiteboard
- **Study Requests**: Connect with senior students for paid tutoring sessions

### 🎯 Campus Life
- **Club Management**: Join and manage college clubs and societies
- **Event Calendar**: Stay updated with campus events and activities
- **Issues Panel**: Report and track campus-related concerns

### 🤝 Social Features
- **Friends System**: Connect with fellow students
- **Real-time Location**: Find friends on campus ([MapImplement Repository](https://github.com/mrinalgaur2005/MapImplement))
- **Study Groups**: Create and join study sessions

### 🎨 Interactive Features
- **Interactive Whiteboard**: Real-time collaborative drawing and teaching
- **Live Chat**: Instant messaging during online classes
- **Resources**: Page for Teachers and Seniors to share resources with students

### 🤖 AI Chat Bot
- Interactive Chatbot which helps you in your day to day activity as well as navigating the entire website in one click!.
- Features it can help you with
  * Ask your marks and get precise results.
  * Ask for events happening in college.
  * Ask for general info about college or website.


## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TailwindCSS, Socket.io-client,
- **Backend**: Node.js, Express.js, Websocket, Groq AI
- **Database**: MongoDB, Qdrant Vector DB
- **Authentication**: JWT, NextAuth.js, NodeMailer
- **Maps**: OpenStreetMap
- **Real-time**: WebSocket, Livekit

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/VaibhavVerma27/Ideathon

# Install dependencies
cd college-compus
npm install

# Set up environment variables
cp .env

# Run the development server
npm run dev
```

## 🔗 API Documentation

# Backend API Routes

Access the entire backend api routes through this [Pastebin Link](https://pastebin.com/Dxr20v9E)

# Frontend API Routes

- `/`: Home Page
- `/events`: Events page
- `/events/add-event`: page to add Events
- `/events/edit-event`: page to edit existing Events
- `/events/[...eventId]`: Single Event info page
- `/MAP`: Map page
- `/clubs`: Clubs page
- `/clubs/[...clubId]`: Single Club info page
- `/issues`: Issues page
- `/issues/add-issues`: Add Issues page
- `/issues/edit-issues`: page to edit your Issues
- `/issues/my-issues`: page to list your Issues
- `/user/friends`: Friends page
- `/study-requests`: Study-Requests Page
- `/resources`: Resources page
- `/dashboard/student`: Student Dashboard page
- `/dashboard/teacher`: Teacher Dashboard page
- `/admin/announcements/add`: Add announcement page for ADMINS
- `/admin/clubs/add-club`: Add Club page for ADMINS
- `/admin/subjects/teacher`: Add/Remove subjects from Teacher page
- `/admin/subjects/teacher`: Add/Remove subjects from Students page
- `/admin/user/make-admin`: page for an Admin to add other user as Admin
- `/admin/user/make-teacher`: page for an Admin to enroll an User as Teacher
- `/study-room/[...roomId]`: Connect to rooms with your teachers or Seniors and study with them.

## 📱 Screenshots

<div align="center">
  <img src="images/Screenshot_20250114_003732.png/" alt="Home" width="800"/>
  <img src="images/Screenshot_20250114_003900.png" alt="Clubs" width="800"/>
  <img src="images/Screenshot_20250114_003945.png" alt="Dashbaord" width="800"/>
</div>

## 🙏 Acknowledgments

- Punjab Engineering College
- ACM Student Chapter
- Our mentors and professors
---

<div align="center">
  Made with ❤️ by PEC Students
  
  [Website]([https://college-compus.vercel.app](https://pec.ac.in/)) · [Report Bug](https://github.com/VaibhavVerma27/Ideathon/issues) · [Request Feature](https://github.com/VaibhavVerma27/Ideathon/issues)
</div>
