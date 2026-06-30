# 🚀 Render Deployment Notes (MERN Backend)

These are my personal notes from deploying my Relocation Companion backend on Render.

---

# 🏗 Tech Stack

- Backend: Node.js + Express
- Database: MongoDB Atlas
- Hosting: Render (Free)
- Frontend: Vercel (to be deployed next)

---

# 1. Push code to GitHub

Make sure the backend is committed and pushed.

```bash
git add .
git commit -m "Backend ready for deployment"
git push origin main
```

---

# 2. Create Web Service on Render

- Login to Render
- New →
- Web Service
- Connect GitHub
- Select repository

---

# 3. Configure Service

Name

```
relocation-companion-api
```

Language

```
Node
```

Branch

```
main
```

Root Directory

```
backend
```

Build Command

```
npm install
```

Start Command

```
npm start
```

Instance

```
Free
```

---

# 4. Add Environment Variables

Copied every variable from local `.env`

Example

```env
PORT=8000

NODE_ENV=development

CORS_ORIGIN=http://localhost:5173

MONGODB_URI=xxxxxxxxxxxxxxxxxxxx

ACCESS_TOKEN_SECRET=xxxxxxxx

ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=xxxxxxxx

REFRESH_TOKEN_EXPIRY=10d
```

---

# 5. Deploy

Click

```
Deploy Web Service
```

or later

```
Manual Deploy
```

---

# ❌ Problem #1

Deployment kept failing.

Render logs showed

```
MongoDB Connection Error:
Could not connect to any servers in your MongoDB Atlas cluster.
```

Initially I thought

- Render issue
- MongoDB issue
- Wrong connection string

None of these were the actual problem.

---

# ✅ Solution #1

Go to

MongoDB Atlas →

```
Network Access
```

Click

```
Add IP Address
```

Add

```
0.0.0.0/0
```

This allows Render servers to connect.

Wait around 30 seconds.

Then

```
Manual Deploy
```

again.

---

# ❌ Problem #2

Still received the same MongoDB error.

Reason:

My MongoDB URI contained the database name.

Example

```text
mongodb+srv://username:password@cluster.mongodb.net/relocation_comparison_pro
```

But my code already appended

```js
/${DB_NAME}
```

inside

```js
mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
```

Result

```text
.../relocation_comparison_pro/Relocation_Companion
```

Wrong path.

---

# ✅ Solution #2

Removed database name from Render environment variable.

Correct URI

```text
mongodb+srv://username:password@cluster.mongodb.net
```

My code automatically appends

```js
Relocation_Companion
```

---

# ❌ Problem #3

I wasn't sure whether changes made in MongoDB Atlas require pushing code to GitHub.

---

# ✅ Solution

No.

Atlas configuration changes are independent of GitHub.

Only redeploy Render.

No git push required.

---

# ❌ Problem #4

Thought changing Environment Variables requires pushing code.

---

# ✅ Solution

No.

After editing Environment Variables

Click

```
Save, rebuild and deploy
```

Render automatically rebuilds the application.

---

# Final Working Configuration

## Root Directory

```
backend
```

## Build Command

```bash
npm install
```

## Start Command

```bash
npm start
```

## Environment Variables

```
PORT
NODE_ENV
CORS_ORIGIN
MONGODB_URI
ACCESS_TOKEN_SECRET
ACCESS_TOKEN_EXPIRY
REFRESH_TOKEN_SECRET
REFRESH_TOKEN_EXPIRY
```

---

# Successful Response

Opening

```
https://your-render-url.onrender.com
```

returned

```json
{
  "success": true,
  "message": "RC-SCRATCH API is running"
}
```

Meaning

✅ Render Deployment Successful

✅ Backend Running

✅ MongoDB Connected

---

# Lessons Learned

- Always whitelist Render using

```
0.0.0.0/0
```

- Don't include database name in URI if code already appends it.

- Environment Variables are managed on Render.

- MongoDB Atlas changes do NOT require GitHub push.

- After changing Environment Variables always

```
Save, rebuild and deploy
```

- Always read Render logs carefully.
Most deployment problems can be solved from the logs.

---

# Deployment Flow

```
Code
      ↓
GitHub
      ↓
Render
      ↓
Build
      ↓
Environment Variables
      ↓
MongoDB Atlas
      ↓
Application Starts
      ↓
Production URL
```

---

# Next Step

Deploy Frontend on Vercel

↓

Update

```
CORS_ORIGIN
```

to

```
https://your-frontend.vercel.app
```

↓

Redeploy Render

↓

Production Ready 🚀