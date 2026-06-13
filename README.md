# 🚀 AI-Powered Job Portal

A full-stack recruitment platform that combines modern job portal functionality with AI-driven resume analysis. Candidates can discover opportunities, apply to jobs, and receive intelligent resume-to-job matching insights, while employers can post jobs and manage applicants through a secure dashboard.

---

## ✨ Features

### Candidate Features

* Secure Registration & Login
* JWT Authentication
* Browse and Search Jobs
* View Detailed Job Descriptions
* Apply for Jobs
* Track Submitted Applications
* AI Resume Matching
* Skill Gap Identification

### Employer Features

* Secure Employer Access
* Create and Manage Job Listings
* View Applicants
* Review Candidate Applications
* AI-Assisted Candidate Evaluation

### AI Features

* Resume vs Job Description Analysis
* Match Score Generation
* Candidate Strength Assessment
* Skill Gap Detection
* Hiring Recommendations

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* Context API

### Backend

* Spring Boot
* Spring Security
* JWT Authentication
* Spring Data JPA
* Maven

### Database

* PostgreSQL

### AI Integration

* Groq API (LLM-powered Resume Analysis)

---

## 🏗️ Architecture

```text
React Frontend
      │
      ▼
Spring Boot REST APIs
      │
      ▼
Spring Security + JWT
      │
      ▼
 PostgreSQL Database
      │
      ▼
 Groq AI Integration
      │
      ▼
 Resume Match Analysis
```

---

## 🔐 Security

* JWT-Based Authentication
* Password Encryption
* Protected Routes
* Role-Based Access Control
* Secure REST APIs

---

## 📋 Core Modules

### Authentication Module

* User Registration
* Login
* JWT Token Generation
* Protected Access

### Job Management Module

* Create Jobs
* Search Jobs
* View Job Details
* Manage Listings

### Application Module

* Submit Applications
* View Application History
* Applicant Tracking

### AI Resume Analysis Module

* Resume Evaluation
* Job Matching
* Skill Gap Analysis
* Candidate Fit Assessment

---

## 📸 Screenshots

### Home Page

<img width="1125" height="595" alt="image" src="https://github.com/user-attachments/assets/20bc0edb-6a47-4886-865c-1227e8256a35" />
<img width="868" height="606" alt="image" src="https://github.com/user-attachments/assets/fa49ef99-cb44-4088-a34e-6e5f13be441a" />

### Job Listings

<img width="1099" height="593" alt="image" src="https://github.com/user-attachments/assets/c4a64d32-ff1a-4bc0-abc8-e6e6069134e3" />

### Employer Dashboard

<img width="864" height="596" alt="image" src="https://github.com/user-attachments/assets/9e7af91a-d184-43eb-8f5e-1dd43dff0eec" />
<img width="864" height="589" alt="image" src="https://github.com/user-attachments/assets/fe6528ed-1d5c-4205-9319-b7564876c714" />

### AI Resume Analysis
<img width="854" height="560" alt="image" src="https://github.com/user-attachments/assets/91e7af23-a197-42eb-901f-859515841a5b" />

<img width="881" height="534" alt="image" src="https://github.com/user-attachments/assets/7f1d17d5-d879-4bcc-9662-6abe35e11665" />

---

## ⚙️ Local Setup

### Backend

```bash
cd backend/backend
./mvnw spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 🔮 Upcoming Enhancements

* Resume PDF Upload & Parsing
* ATS-Style Resume Evaluation
* Applicant Shortlisting Workflow
* Candidate Status Management
* Interview Scheduling
* Advanced Employer Dashboard
* Enhanced AI Feedback
* Production Deployment
* Analytics & Reporting

---

## 🎯 Key Learnings

This project provided hands-on experience with:

* Full-Stack Development
* Spring Security & JWT
* PostgreSQL Database Design
* REST API Development
* React State Management
* AI API Integration
* Role-Based Access Control
* Resume Analysis Workflows

---

## 👩‍💻 Author

Samanwita

Built using React, Spring Boot, PostgreSQL, and Groq AI.
