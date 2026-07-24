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

Just quickly, JWT is a secure way to trasmit information between parties as a JSON object. The information is verified and trusted as it is a signed resource (Using HMAC or a public/private key pair). Signed tokens I believe are the most common and are all I will focus on here. They consist of:
*Header* - Which algo is used and what is the type of token?
*Payload* - Contains what is known as 'claims'. Essentially, what information you want to send (Private claims) usually accompanied by some default information such as issuer and expiration time (Known as registered claims).
*Signature* - This is the 'key'. It uses an encoded version of the header and payload, a secret and the algorithm specified to create a string.
[Information Reference](https://www.jwt.io/)

The `jsonwebtoken` library gives access to three functions.

`jwt.sign(payload, secret, options)` - This is a function that will essentially create the entire JWT. This function builds the header, base64 encodes the header AND the payload, computes the HMAC (A cryptographic algorithm) using the encoded header, encoded payload and the secret and strings it all together to create the JWT returning a string.

`jwt.verify(token, secret, options)` - This is arguably the most important. It splits the token into it's parts, recomputes the signature from the header and payload it received and compares it to the attached signature. If they're different, it is an invalid JWT. If they're the same, it is valid. It will also check other claims to see if the token has expired or is valid. If all is good, it will return the decoded payload.

`jwt.decode(token)` - Does the same as verify *without* checking the signature. May seem useless, but often used to read claims off an already trusted token. Must be used with caution as using decode instead of verify is a real security vulnerability.

In the `auth.js` middleware I signed a JWT and attached it to `req.auth`, using Postman to send an authorisation header. In the `router.delete(/users/:id)` route, I used the id in req.auth to grab the user from the database as an example. From here, the auth.js middleware can be built up further.