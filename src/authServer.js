// import the variables from the .env file we created
require("dotenv").config()
const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
const posts = require("./utils/db")


app.use(express.json()) 

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


let refreshTokens = []

app.post("/token", (req, res) => {
const refreshToken = req.body.refreshToken
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken })
  })
})

app.delete("/logout", (req, res) => {
  const refreshTokenToDelete = req.body.refreshToken
  if (!refreshTokenToDelete) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshTokenToDelete)) return res.sendStatus(403)
  refreshTokens = refreshTokens.filter(
    (token) => token !== req.body.refreshToken
  )
  res.sendStatus(204)
})

app.post("/login", (req, res) => {
  //   Authenticate user, to be completed based on the other video. Currently, any value we put for "username" will generate a token.
  const username = req.body.username
  if (!username) return res.sendStatus(401)

  const user = { name: username }

  const accessToken = generateAccessToken(user)
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)

  refreshTokens.push(refreshToken)

  res.json({ accessToken: accessToken, refreshToken: refreshToken })
})

const generateAccessToken = (user) => {
  // Serialize the user data(name), access token & when the token expires
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1m" })
}


app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name))
})

module.exports = app
