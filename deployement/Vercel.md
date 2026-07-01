# 🚀 Relocation Companion Pro - Deployment Notes

> Lessons learned while deploying my first production-ready MERN application.

---

# 🌍 Tech Stack

Frontend
- React + Vite
- Vercel

Backend
- Node.js
- Express
- MongoDB Atlas
- Render

Database
- MongoDB Atlas

Authentication
- JWT
- Refresh Token
- HTTP Only Cookies
- Authorization Header

---

# ✅ Deployment Order

Always deploy in this order.

1. MongoDB Atlas
2. Backend (Render)
3. Test backend endpoints
4. Frontend (Vercel)
5. Connect frontend with backend
6. Test every authenticated route

Never deploy frontend before backend API is working.

---

# Backend Deployment Checklist

## Environment Variables

```
PORT

NODE_ENV=production

MONGODB_URI

ACCESS_TOKEN_SECRET
ACCESS_TOKEN_EXPIRY

REFRESH_TOKEN_SECRET
REFRESH_TOKEN_EXPIRY
```

---

## CORS

Current code

```js
cors({
    origin: [
        "http://localhost:5173",
        "https://relocation-companion-pro.vercel.app"
    ],
    credentials: true
})
```

Because origins are already hardcoded inside Express,

Render's

```
CORS_ORIGIN
```

environment variable is unnecessary.

Either remove it or ignore it.

---

# Frontend

Never hardcode localhost after deployment.

Instead of

```
http://localhost:8000
```

use

```
https://relocation-companion-api.onrender.com/api/v1
```

Eventually replace this with

```
VITE_API_URL
```

inside

```
.env
```

---

# Authentication Journey

This was the biggest debugging session.

Initially

✅ Login worked

But

❌ Profile returned 401

❌ Saved Comparisons returned 401

❌ Save Comparison returned 401

Everything protected failed.

---

## First Assumption

I thought

verifyJWT

was broken.

It wasn't.

---

## Second Assumption

I thought

cookies were not being sent.

Not the issue either.

---

## Third Assumption

I checked

```
document.cookie
```

Only Clerk cookies appeared.

This confused me because I had already removed Clerk from the project.

Later I realised:

Those cookies belonged to localhost from an older project.

They had nothing to do with my application.

Never assume browser cookies belong to the current project.

---

## Actual Problem

Frontend was successfully logging in.

Backend successfully generated JWT.

But subsequent requests were not authenticated.

The solution was sending the JWT manually using Axios.

---

# Final Axios Configuration

```js
import axios from "axios";

export const api = axios.create({
    baseURL: "...",
    withCredentials: true,
});

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("accessToken");

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
```

This fixed every authenticated request.

---

# Login Flow

After login

Save

```
accessToken
```

inside

```
localStorage
```

Then

```
setUser(user)
```

Navigate home.

Never forget to remove the token during logout.

```
localStorage.removeItem("accessToken")
```

---

# MongoDB Bug

I accidentally connected backend to

```
Relocation_Companion
```

which was my old database.

That collection was empty.

Cities endpoint returned

```
[]
```

Backend wasn't broken.

Database selection was.

Correct database

```
relocation_comparison_pro
```

Always verify

```
DB_NAME
```

before debugging APIs.

---

# First Lesson About Databases

If API returns

```
[]
```

Don't debug controllers first.

Check

1. Database connection

2. Database name

3. Collection

4. Data

Only after that debug code.

---

# Debugging Strategy I Learned

Never randomly change code.

Instead

Check in this order

## Step 1

Is backend running?

---

## Step 2

Does endpoint work in browser/Postman?

---

## Step 3

Is frontend calling correct endpoint?

---

## Step 4

Network tab

Status code

```
200
401
404
500
```

---

## Step 5

Backend terminal

Console logs

---

## Step 6

Browser console

---

## Step 7

Database

---

Changing code should always be the last step.

---

# 401 Means

Usually one of these

- Missing token

- Expired token

- Invalid token

- Authorization header missing

- verifyJWT failed

Do not immediately assume backend is broken.

---

# 404 Means

Usually

Wrong route

Wrong baseURL

Wrong API path

---

# Empty Array Means

Usually

Wrong database

Wrong collection

No data

Not backend logic.

---

# Deployment Lessons

Production bugs are usually

Configuration bugs

NOT

Programming bugs.

---

# Things I Should Always Check

Before spending hours debugging

✔ Backend URL

✔ MongoDB connection

✔ DB_NAME

✔ Environment Variables

✔ JWT Secret

✔ API Base URL

✔ Network Tab

✔ Authorization Header

✔ Browser Storage

✔ Cookies

✔ Render Logs

---

# Things That Wasted My Time

Thinking

verifyJWT

was broken.

Thinking

Clerk

was still inside my project.

Debugging controllers before checking database.

Forgetting which MongoDB database my backend was connected to.

---

# Biggest Realisation

Deployment is mostly

Configuration

Networking

Authentication

Environment Variables

Not coding.

---

# Next Project Checklist

Before first deployment

- Environment variables ready

- Production API URL ready

- MongoDB Atlas connected

- DB_NAME verified

- CORS verified

- JWT verified

- Render deployed

- Backend tested

- Frontend deployed

- Login tested

- Profile tested

- Logout tested

- Protected routes tested

- Save/Delete tested

---

# Personal Reminder

When something breaks

Don't panic.

Don't rewrite code.

Don't assume.

Verify one layer at a time.

Frontend

↓

Network

↓

Backend

↓

Database

↓

Authentication

Every production bug has a logical cause.

Find evidence first.

Then fix.