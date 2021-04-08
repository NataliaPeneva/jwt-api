// import the variables from the .env file we created
require("dotenv").config()

const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")

app.use(express.json())

let refreshTokens = []

app.post("/token", (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken })
  })
})

app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token)

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

module.exports = app
