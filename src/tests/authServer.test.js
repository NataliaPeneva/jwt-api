const authServer = require("../../authServer")
const supertest = require("supertest")
const request = supertest(authServer)

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
    // console.log("It works", response)
    done()
  })
})
