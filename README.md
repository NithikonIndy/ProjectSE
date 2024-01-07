# API server tests

It includes the following:

- Backend API with Express & MongoDB
- Routes for sign in from cmu authentication,
- Custom error middleware
- Oauth with CMU account
- func check new user & old user
- func update role admin
- Save data from res to database

### To start server with API(Backend only)

```
1. npm install
2. npm run server
```

### Remaining task to be done

- Routes for logout, register, profile, update profile
- JWT authentication stored in HTTP-only cookie
- Protected routes and endpoints
- Custom middleware to check JSON web token and store in cookie
