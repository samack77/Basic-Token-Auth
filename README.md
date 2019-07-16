# Basic-Token-Auth
NodeJS project to authenticate users by token, using jwt, Mongoose, crypto, Express; You can see also how to upload files to AWS S3.

# Endpoints

**/auth/sign-up** => Public, endpoint to register one user

**/auth/sign-in** => Public, endpoint to login into the APP

**/users/me** => Private, to get info by current user, you need a token

**/upload** => Public to upload files on test mode

**/** => Public endpoint to test API

# How to test private endpoint

To test this, you'll need a token you get on Sing up or Sing in methods. You might do like this:

> content-type: application/x-www-form-urlencoded
Authorization: Bearer yourLongTokenHere

**This app run on port 3000**
