// import the variables from the .env file we created
require("dotenv").config()

const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")

app.use(express.json())

const posts = [
  {
    username: "Natalia",
    title: "post 1",
  },
  {
    username: "Anton",
    title: "post 2",
  },
]

const authenticateToken = (req, res, next) => {
  // Returns the Bearer token. The format is "Bearer token", that's why we split in the token variable.
  const authHeader = req.headers["authorization"]
  // returns either an undefined or the actual token.
  const token = authHeader && authHeader.split(" ")[1]
  if (token == null) return res.sendStatus(401)

  // until now we've checked if we have a valid token. Below, we verify the token.
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    // The error is that the token is no longer valid.
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name))
})

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Listening on port ${port}`))
