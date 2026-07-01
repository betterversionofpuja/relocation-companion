---

# React Router + Vercel 404 Issue

## Problem

Everything worked normally when navigating inside the application.

Example

```
/
↓
Compare
↓
Profile
↓
Saved Comparisons
```

However, refreshing any page except the homepage resulted in

```
404: NOT_FOUND
```

Example

```
/profile
/compare
/saved-comparisons
```

Home page (`/`) refreshed correctly.

---

## Initial Thoughts

I initially suspected

- React Router
- Backend routes
- Express routes
- API deployment

None of them were the problem.

---

## Root Cause

This was a Vercel deployment issue.

When refreshing

```
https://my-app.vercel.app/profile
```

the browser sends a request directly to Vercel.

Vercel tries to find

```
/profile
```

as a real file.

Since it doesn't exist,

Vercel returns

```
404 NOT_FOUND
```

React Router never gets a chance to render the page.

---

## Solution

Create

```
vercel.json
```

inside the frontend root.

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Commit and push.

Vercel automatically redeploys.

---

## Why this works

Every request

```
/
```

```
/profile
```

```
/compare
```

```
/saved-comparisons
```

is rewritten to

```
index.html
```

React Router then decides which component to render.

---

## Lesson Learned

A React SPA has only one HTML file.

```
index.html
```

Every route must eventually load that file.

The frontend router is responsible for rendering pages—not Vercel.

---

## Deployment Checklist

Whenever deploying a React + React Router application

✔ Add

```
vercel.json
```

✔ Configure rewrite rules

✔ Test direct URL access

```
/profile
```

```
/compare
```

```
/saved-comparisons
```

✔ Refresh every protected route

---

## Personal Reminder

If the application works while navigating normally but breaks only after refreshing a page,

don't debug React.

Don't debug Express.

Don't debug MongoDB.

Check the hosting platform's routing configuration first.

For Vercel, the first thing to verify is

```
vercel.json
```

This is a deployment configuration issue, not an application logic issue.