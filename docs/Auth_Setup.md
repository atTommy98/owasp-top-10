# Authorisation Setup

## Why Is Auth Needed?
Access control decides whether the person making a request is allowed to do the thing they are asking for. That is impossible without first answering *who* is making the request.

The original users routes had no answer. Every request was anonymous, so `DELETE /users/:id` had nothing to check against and anybody could remove any account. To continue with security issues, I needed a way to attach an identity, and a role, to each incoming request.

Worth separating the two ideas:
**Authentication** proves you are who you say you are.
**Authorisation** decides what you are allowed to do.

## What I Did
Two candidate packages:
- **`express-jwt`** is Express middleware. All you have to do is configure it once, drop it in middleware and it will pull the token from the header, verify it, reject bad requests and populate `req.auth` for you.
- **`jsonwebtoken`** is the lower level library `express-jwt` uses underneath. It gives you `sign()` and `verify()`, and nothing else.

I went with **`jsonwebtoken`**. `express-jwt` is the better choice for production work precisely because it removes the parts that are easy to get wrong, which is exactly why I avoided it here. This repository is about understanding how these vulnerabilities happen and a library that handles verification silently hides the step I want to reason about. Writing the middleware by hand forces each decision to be explicit.