# Broken Access Control

## Description & Background

'Broken Access Control' is the leading position at #1 in the top 10 security flaws. With 100% of the applications tested
fond to have some form of broken access control, it allows attackers and exploiters access to unauthorised informatio,
modification or destruction of data and allows the user to perform some business function outside of the user's intended
limits. Common vulnerabilities include:

- Violation of the principle of least privilege (Commonly known as deny by default) where acecss should only be granted
  for particulra capabilities, roles or users but is available to anyone.
- Bypassing access control checks by modifying the URL (parameter tampering or force browsing), internal application
  state or the HTML page. Attackers could also use a tool that modifies API requests in some way.
- Permitting viewing or editing of someone else's account by providing it's unique identifier.
- An accessible API with missing access controls for POST, PUT and DELETE.
- Elevation of privilege, that is, acting as a user without being logged in or having access to privileges beyond that
  expected of the logged in user (e.g admin access)
- Metadata manipulation such as modifying a JWT, cookie or hidden field.
- CORS misconfiguring allowing API access from unauthorised or untrusted origins.
- Force browsing (Guessing URLs) to authenticated pages as an unauthenticated user. to name a few.

## Prevention

Prevention of exploitation of Broken Access Control comes in the form of preventing the user from accessing or modifying
an access control check or corresponding metadata.

- Except for public resources, deny by default.
- Implement access control mechanisms once and reuse throughout the application including minimising CORS usage.
- Model access controls should enforce record ownership rather than allowing users to CRUD any record.
- Unique application business limit requirements should be enforced by domain models.
- Disable web server directory listing and ensure file metadata (e.g., .git) and backup files are not present within web
  roots.
- Log access control failures, alert admins when appropriate (e.g., repeated failures).
- Implement rate limits on API and controller access to minimize the harm from automated attack tooling.
- Stateful session identifiers should be invalidated on the server after logout. Stateless JWT tokens should be
  short-lived to minimize the window of opportunity for an attacker. For longer-lived JWTs, consider using refresh
  tokens and following OAuth standards to revoke access.
- Use well-established toolkits or patterns that provide simple, declarative access controls.

## Exploring This Vulnerability (What I Did)

Created basic USERS routes where anybody could CRUD users. There is no authorisation at all.

### 1. Vertical Privilege Escalation

**What is it?**

When a user is able to move up the permission hierarchy. For example, a normal user accessess admin privileges such as
being able to delete a resource when their role isn't allowed.

**What did I do to address it?**

Ensure user role and permission checks on the _/users/delete_ route. For this to be possible, I had to setup some form
of auth so that we know _who_ is making the request. I chose JWT, specifically the 'jsonwebtoken' package rather than
the 'express-jwt' package which simplifies the auth process. (See **Auth_Setup** doc for more information)

### 2. Horizontal Privilege Escalation

**What is it?**

If a user is able to gain access to another user's resources when they shouldn't be able to. It's an exploit of
permissions that allows access to sensitive data or resources through a variety of routes. Commonly Insecure Direct
Object Reference (IDOR, altering parameters) or Cross Site Request Forgery (CSRF, abusing logged in users).

**What did I do to address it?**

Created the route in `resources.js` that grabs a users information based on the requested ID. Then I asked myself:

- Who does the requested resource belong to?
- Who is requesting the resource?

To handle this, we first check that the id is valid before using computational resource on DB requests. If it's ok, we
grab the requesting user from auth and the requested user from the db. If we got some user information, we then want to
know if the requesting user is either an admin **OR** the owner. If they are either, send the resource, otherwise return
a 403, defaulting to a deny so the route is essentially whitelisted.

### 3. Insecure Direct Object Reference (IDOR)

**What is it?**

Similarly to Horizontal Privilege Escalation, IDOR is when a user changes an identity value to access some item or
resource that they should not be allowed to receive. Specifically, IDOR is a mechanism behind Horizontal Privilege
Escalation. For example, modifying an ID to view someone else's data is an IDOR vulnerability that resulted in
Horizontal Privilege Escalation. Equally, an IDOR can result in vertical privilege escalation (Perhaps by changing
`?file=report.pdf` to `?file=admin_config.php`).

**What did I do to address it?**

While this is already technically addressed in the `GET /resources/users/:id` route, I wanted to make sure that I
understood an IDOR vulnerability from a perspective where the ID of the object differs from the owner (unlike the
resources route) so I have created a new table `Posts` and will create some dummy data for some of the user's in my
database. I then created another GET route at `/posts/:id` and created a similar vulnerability, fixing it shortly after.

### 4. Missing Ownership Checks

**What is it?**

Similarly to #3, Missing Ownership Checks have technically already been addressed on the read path. IDOR answers 'How
did they reach the resource?', Horizontal Privilege Escalation answers 'What did they gain?' and Missing Ownership Check
answers 'What's wrong in my code?'. Though it may seem like a separate item, really they're all part of the same thing
which is an Access Control issue. They're separate concepts as they may not always coincide, such as the example above
where changing `file=report.pdf` to `file=admin_config.php` is an IDOR producing **vertical escalation** rather than
horizontal

**What did I do to address it?**

To further emphasise a Missing Ownership Check specifically, I created a `GET /posts` route, where there is no ID to
tamper with (No IDOR to tamper with) which has a horizontal impact rather than vertical. I'm adding 3 routes to further
demostrate this. They are `PATCH /posts/:id`, `GET /posts` amd `DELETE /posts/:id`.

There are two ownership questions.

1. Who may act on this record?
2. May you set this field on it?

`PATCH /posts/:id` - Has to answer both because on a write operation, the `authorId` field is a value which points to
ownership, which answers question 1. If we let a user write the `authorId`, then we have allowed the user to rewrite who
owns the record. FOr example, `pATCH /posts/5` with `{"content":"whatever","authorId":2}`, where Post is mine rewrites
the Post to change the ownership to author number 2, who becomes the victim in this scenario. The difference is
essentially instead of **reading** someone else's data, I am *writing* into their account where an audit trail will say
it's theirs.

This can get worse with something like a `PATCH` on `/users/:id` with `{"role": "ADMIN"}` which would allow a user to
change a user's role to role admin if not correctly guarded against.

So first I created the basic route, receive `req.body`, `PATCH` the post with the content and return it. This is the
broken version. To fix this

`GET /posts` - Shows missing ownership does not necessarily equal an IDOR because there's no ID to tamper with. The
where clause is the fix, rather than a guard.

`DELETE /posts/:id` -

### 5. Forced Browsing

### 6. Callable Disabled Functionality

### 7. Parameter Manipulation

### 8. Bypassing Workflow Restrictions

### 9. Data Leakage

### 10. Accessing Resources After Permissions Change
