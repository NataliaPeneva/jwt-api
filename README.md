This API is using JWT for user authentication. It generates Access tokens, valid for a pre-defined period of time, as well as Refresh tokens, which can also be invalidated when needed.

For additional convenience, the authentication is running on a separate server from the main API.

The commands in the instructions below are for UNIX systems.

# How to install

1. Clone the git repository
2. Run yarn to install the necessary packages.

> yarn install

# How to use

Create a file called `.env` and run the below in terminal:

> node

> require('crypto').randomBytes(64).toString('hex')

This will return a secret token by running the crypt library in node.js. We need 2 tokens, so you will have to run the second line of code twice. On UNIX, to go out of the node mode, press `ctrl + C` twice, `ctrl + D` or type `.exit`.

Within the `.env` file, create 2 variables which will contain the previously generated secret tokens. They should be called `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`. In the end, the file should contain something similar:

```
 ACCESS_TOKEN_SECRET='ef5c20ee7be5863aec28cb41bd2f3805f0dc4802d47d19e4bd2a90936663594348e4f2fd3a821b59be02cc0a690fa956996cf77cdcc591c03c20e8d21c5ba5e7'
 REFRESH_TOKEN_SECRET='d9699129d62b292d97ca2237779359e945a0ff2b5dc4d12969e77a528fe45387a388dbbd809c302ab91e00fdcc6c99d638b068917223435e820417993fcbre97'
```

# How to start the servers

In terminal, run the below command:

> `yarn start`

In a separate terminal window, run the below command:

> `yarn start:auth`

This will allow you to run both servers at the same time.

# How to test

[Postman](https://www.postman.com/) is a great tool for testing the api. The below outline is based on that functionality.

![Endpoints](/endpoints.png)

## Logging In

To log in, make a `POST` request to (http://localhost:4000/login). In the body, send an object containing a username in the following format: `{ "username": "Natalia" }`. The response should have an `"accessToken"` and a `"refreshToken"` wrapped in an object and look similar to:

```
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTmF0YWxpYSIsImlhdCI6MTYxNzg4OTQ0NSwiZXhwIjoxNjE3ODg5NTA1fQ.iH67QVlt1TXG9usP-YPOSz0zpkuZmYiCES3ncIvNChQ",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTmF0YWxpYSIsImlhdCI6MTYxNzg4OTQ0NX0.a8YUrKLlMU-dlI7DYH3u94j6dWo4GCoa0kd_w2OxeS4"
}
```

If the request is an empty object, the response will be with Status `401 Unauthorized`.

The access token is set to expire after 1 minute for testing purposes. That can be increased / decreased based on your needs in the `generateAccessToken` middleware in `src/authServer.js`.

#

## Getting Posts

There are already two predefined users to test the application. To get the information associated with one of them, make a `GET` request to (http://localhost:3000/posts). The request's Authorization header should contain `Bearer` + empty space, followed by a valid active `accessToken`. If the user associated with this token can be found in the predefined users (can be found in `posts` in `utils/db.js`), the response will be in the format below:

```
[
    {
        "username": "Natalia",
        "title": "post 1"
    }
]
```

If the `accessToken` is valid but a user can't be found, the response will be an empty array `[]`.

If the `accessToken` is not valid or can't be found, the response will be with Status `403 Forbidden`.

#

## Getting A New Access Token By Using The Refresh Token

To get a new access token, make a `POST` request to (http://localhost:4000/token). In the body of the request, send an object containing an already existing `refreshToken` in the below format:

```
{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTmF0YWxpYSIsImlhdCI6MTYxNzg4OTQ0NX0.a8YUrKLlMU-dlI7DYH3u94j6dWo4GCoa0kd_w2OxeS4"
}
```

The response will be an object with a new `accessToken`.

If the `refreshToken` is not valid or can't be found, the response will be with Status `403 Forbidden` and no `accessToken` will be generated.

#

## Logging Out

To log out, make a `DELETE` request to (http://localhost:4000/logout). In the body of the request, send an object containing an already existing `refreshToken` which access you would like to revoke. The format should be the same as the one in the `POST` request to (http://localhost:4000/token). The response will be with Status `204 No Content` if the `refreshToken` was successfully deleted.
