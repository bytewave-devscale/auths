# API Documentation

## [POST] /api/v1/auth/register

### Description

Save new user data into users database, create access token and refresh token. Return userId, access token and refresh token.

### Data Body

```
{
    "username":string,
    "email":string,
    "password":string
}
```

### Return

If the registration succeeds, the json returned:

```
{
    "userId":string,
    "accessToken":string,
    "refreshToken":string
}
```

if the registration fails, the json returned:

```
{
    "error":string
}
```

## [POST] /api/v1/auth/login

### Description

Receive user's email and password, compare them to the users database and if match, return access token and refresh token for the user.

### Data Body

```
{
    "email":string,
    "password":string
}
```

### Return

If the login succeeds, the json returned:

```
{
    "userId":string,
    "accessToken":string,
    "refreshToken":string
}
```

if the login fails, the json returned:

```
{
    "error":string
}
```

## [POST] /api/v1/auth/logout

### Description

Receive access token and refresh token. It will remove the given refresh token from auths database. Return message.

### Data Body

```
{
    "accessToken":string,
    "refreshToken":string,
}
```

### Return

If the logout succeeds, the json returned:

```
{
    "message":string
}
```

if the logout fails, the json returned:

```
{
    "error":string
}
```

## [POST] /api/v1/logout/all

### Description

Receive assess token and refresh token. it will remove all the user's refresh token in auths database. Return message.

### Data Body

```
{
    "accessToken":string,
    "refreshToken":string,
}
```

### Return

If the logout all succeeds, the json returned:

```
{
    "message":string
}
```

if the logout all fails, the json returned:

```
{
    "error":string
}
```

## [POST] /api/v1/auth/authorize

### Description

Given access token and refresh token, it will verify those token. Returns userId if access token valid. Returns userId and new access token, if access token invalid while refresh token valid. Returns error message if both tokens invalid.

### Data Body

```
{
    accessToken:string,
    refresToken:string
}
```

### Return

If access token valid

```
{
    "userId":string
}
```

if access token invalid, refresh token valid

```
{
    "userId":
    "accessToken":
}
```

if both tokens invalid

```
{
    "error":string
}
```

### Example

Here is the example on how you can use authorize in your auth middleware

```
import { Request, Response, NextFunction } from "express";

export function createAuthMiddleware(tokens: {
  accessToken: string;
  refreshToken: string;
}) {
  return async function (
    req: Request & {
      authData: { error?: string; userId?: string; accessToken?: string };
    },
    res: Response,
    next: NextFunction
  ) {
    // get accessToken and refresToken from cookies
    const { accessToken, refreshToken } = tokens;

    // fetch auth service
    const authResponse = await fetch(
      "http://auth-service-uri/api/v1/auth/authorize",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, refreshToken }),
      }
    );

    const authData = await authResponse.json();

    // if authorize return error
    if ("error" in authData) {
      // do something if error/authorization fail
    }

    // here you have authData containing userId, or userId and new accessToken if accessToken used before is invalid but the refreshToken valid

    // do something ...

    next();
  };
}
```

use the middleware :

```
app.use("/protected", createAuthMiddleware({accessToken:..., refreshToken:...}))
```
