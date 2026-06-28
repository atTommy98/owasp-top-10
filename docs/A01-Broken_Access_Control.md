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
