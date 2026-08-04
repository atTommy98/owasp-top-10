# Broken Access Control

## Description & Background

'Broken Access Control' is the leading position at #1 in the top 10 security flaws. With 100% of the applications tested fond to have some form of broken access control, it allows attackers and exploiters access to unauthorised informatio, modification or destruction of data and allows the user to perform some business function outside of the user's intended limits. Common vulnerabilities include:

- Violation of the principle of least privilege (Commonly known as deny by default) where acecss should only be granted for particulra capabilities, roles or users but is available to anyone.
- Bypassing access control checks by modifying the URL (parameter tampering or force browsing), internal application state or the HTML page. Attackers could also use a tool that modifies API requests in some way.
- Permitting viewing or editing of someone else's account by providing it's unique identifier.
- An accessible API with missing access controls for POST, PUT and DELETE.
- Elevation of privilege, that is, acting as a user without being logged in or having access to privileges beyond that expected of the logged in user (e.g admin access)
- Metadata manipulation such as modifying a JWT, cookie or hidden field.
- CORS misconfiguring allowing API access from unauthorised or untrusted origins.
- Force browsing (Guessing URLs) to authenticated pages as an unauthenticated user.
  to name a few.

## Prevention

Prevention of exploitation of Broken Access Control comes in the form of preventing the user from accessing or modifying an access control check or corresponding metadata.

- Except for public resources, deny by default.
- Implement access control mechanisms once and reuse throughout the application including minimising CORS usage.
- Model access controls should enforce record ownership rather than allowing users to CRUD any record.
- Unique application business limit requirements should be enforced by domain models.
- Disable web server directory listing and ensure file metadata (e.g., .git) and backup files are not present within web roots.
- Log access control failures, alert admins when appropriate (e.g., repeated failures).
- Implement rate limits on API and controller access to minimize the harm from automated attack tooling.
- Stateful session identifiers should be invalidated on the server after logout. Stateless JWT tokens should be short-lived to minimize the window of opportunity for an attacker. For longer-lived JWTs, consider using refresh tokens and following OAuth standards to revoke access.
- Use well-established toolkits or patterns that provide simple, declarative access controls.

## Exploring This Vulnerability (What I Did)

Created basic USERS routes where anybody could CRUD users. There is no authorisation at all.

### Vertical Privilege Escalation

**What is it?**
When a user is able to move up the permission hierarchy. For example, a normal user accessess admin privileges such as being able to delete a resource when their role isn't allowed.

**What did I do to address it?**
Ensure user role and permission checks on the _/users/delete_ route. For this to be possible, I had to setup some form of auth so that we know _who_ is making the request. I chose JWT, specifically the 'jsonwebtoken' package rather than the 'express-jwt' package which simplifies the auth process. (See **Auth_Setup** doc for more information)

### Horizontal Privilege Escalation

**What is it?**
If a user is able to gain access to another user's resources when they shouldn't be able to. It's an exploit of permissions that allows access to sensitive data or resources through a variety of routes. Commonly Insecure Direct Object Reference (IDOR, altering parameters), Cross Site Request Forgery (CSRF, abusing logged in users), Session Hijacking (Stealing tokens) and Credential Theft (Using leaked data).

**What did I do to address it?**
Created the route in `resources.js` that grabs a users information based on the requested ID. Then I asked myself:

- Who does the requested resource belong to?
- Who is requesting the resource?

To handle this, we first check that the id is valid before using computational resource on DB requests. If it's ok, we grab the requesting user from auth and the requested user from the db. If we got some user information, we then want to know if the requesting user is either an admin **OR** the owner. If they are either, send the resource, otherwise return a 403, defaulting to a deny so the route is essentially whitelisted.

### Insecure Direct Object Reference (IDOR)

**What is it?**
Similarly to Horizontal Privilege Escalation, IDOR is when a user changes an identity value to access some item or resource that they should not be allowed to receive. Specifically, IDOR is the mechanism behind Horizontal Privilege Escalation. For example, modifying an ID to view someone elses data is an IDOR vulnerability that resulted in Horizontal Privilege Escalation. Equally, an IDOR can result in vertical privilege escalation (Perhaps by changing `?file=report.pdf` to `?file=admin_config.php`).

**What did I do to address it?**
While this is already technically addressed in the `GET /resources/users/:id` route, I wanted to make sure that I understood an IDOR vulnerability from a perspective where the ID of the object differs from the owner (unlike the resources route) so I have created a new table `Posts` and will create some dummy data for some of the user's in my database. I then created another GET route at `/posts/:id` and created a similar vulnerability, fixing it shortly after.

### Missing Ownership Checks

### Forced Browsing

### Callable Disabled Functionality

### Parameter Manipulation

### Bypassing Workflow Restrictions

### Data Leakage

### Accessing Resources After Permissions Change
