const authServer = require("../authServer")
const serverJS = require("../server")
const supertest = require("supertest")
const request = supertest(authServer)
const request2 = supertest(serverJS)
const jwt = require("jsonwebtoken")

describe("authServer/login", () => {
  test("should respond with tokens when given a username", async (done) => {
    // arrange
    const body = {
      username: "Johnny",
    }
    // act
    const response = await request.post("/login").send(body)

    // assert
    expect(response.body.accessToken).toBeDefined()
    expect(response.status).toBe(200)
    done()
  })
})

describe('"authServer/token"', () => {
  test("should respond with a new access token given a refresh token", async (done) => {
    // arrange, make a refresh token
    const body = {
      username: "Johnny",
    }
    const response = await request.post("/login").send(body)
    const refreshToken = response.body.refreshToken

    // act, make a req with the refresh token
    const responseAccessToken = await request
      .post("/token")
      .send({ refreshToken })

    // assert we get a valid access token
    expect(responseAccessToken.body.accessToken).toBeDefined()
    const user = await jwt.verify(
      responseAccessToken.body.accessToken,
      process.env.ACCESS_TOKEN_SECRET
    )
    expect(user.name).toBe("Johnny")
    done()
  })
})

describe('"authServer/token"', () => {
  test("should respond with 401 error if refresh token is an empty object", async (done) => {
    // act, make a req with the refresh token
    const responseAccessToken = await request.post("/token").send({})

    // assert we get a valid access token
    expect(responseAccessToken.status).toBe(401)

    done()
  })
})

describe('"authServer/token"', () => {
  test("should respond with 403 error if refresh token is not valid", async (done) => {
    // act, make a req with the refresh token
    const responseAccessToken = await request
      .post("/token")
      .send({ refreshToken: "bla" })

    // assert we get a valid access token
    expect(responseAccessToken.status).toBe(403)

    done()
  })
})

describe('"server/posts"', () => {
  test("should respond with a posts object", async (done) => {
    // arrange, make a refresh token
    const body = {
      username: "Natalia",
    }
    const response = await request.post("/login").send(body)
    const accessToken = response.body.accessToken

    // act, make a req with the access token. .set() checks the header.
    const responsePosts = await request2
      .get("/posts")
      .set("Authorization", `Bearer ${accessToken}`)
      .send()

    // assert we get a valid access token
    expect(responsePosts.body).toEqual([
      {
        username: "Natalia",
        title: "post 1",
      },
    ])

    done()
  })
})

describe('"authServer/logout"', () => {
  test("should respond with 204 if refresh token successfully deleted", async (done) => {
    // arrange, make a refresh token
    const body = {
      username: "Natalia",
    }
    const response = await request.post("/login").send(body)
    const refreshToken = response.body.refreshToken

    // act, make a req with the refresh token
    const responseAccessToken = await request
      .delete("/logout")
      .send({ refreshToken })

    // assert we deleted the refresh token
    expect(responseAccessToken.status).toBe(204)

    done()
  })
})

