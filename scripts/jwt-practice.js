import jwt from "jsonwebtoken";
const secret = "this-is-a-super-mega-secret-by-the-way";

// const signedToken = jwt.sign(
//   {
//     name: "Tommy",
//     age: "28",
//   },
//   secret,
//   { expiresIn: "60s" },
// );

const signedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.dQekFJn5YOnmxBbKEUrRjslnz6JCn7i6YZm9hKFkr_A'

const verified = jwt.verify(signedToken, secret)

console.log(signedToken)
console.log(verified)