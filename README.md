# Lite Twitter

> All the basic functionalities work, a lighter version of twitter.

Currently running on:
* front-end: https://litetwitter.netlify.app/
* back-end: https://litetwitter.herokuapp.com/ (it takes a while for the back-end to start)

Lite Twitter is minimal twitter clone where you can:
1. Create an account or log in to existing account
2. Read all messages or just one user's messages
3. Follow users
4. Read messages by followed users
5. Send messages
6. Update profile information

## About

The whole app is built using TypeScript with ESLint.
Client is made with React and Material UI.
Server is made with Express, TypeORM and TypeGraphQL.
PostgreSQL is used as database.

## Demo

### Landing Page

<img alt="langing page demo" src="./assets/landing.gif?raw=true" width="100%">

### Home Page

<img alt="langing page demo" src="./assets/home.gif?raw=true" width="100%">

### User Page

<img alt="langing page demo" src="./assets/user.gif?raw=true" width="100%">

## Client

Client is initialized with create-react-app using TypeScript template. Client uses react, material ui, react-router-dom, formik and apollo client.

### ENV setup

Create .env file to the root of the client folder.
Requires URI to GraphQL API.

>example

```
REACT_APP_API_URI=http://localhost:4000/graphql 
```

## Server

Server provides GraphQL API. Server uses express, typeorm, typegraphql, apollo-server-express, argon2 and jsonwebtoken.

### ENV setup

Create .env file to the root of the server folder.
Requires database URI that contains:
- user
- password
- host
- database name

also requires port and secret.

>example

```
DATABASE_URL=postgres://postgres:root@localhost:5432/chat
PORT=4000
SECRET="kB1jlAl4kfjl_kPf32l"
```

## Running locally

### Server

```
cd graphql_litwitter/server
npm install
(ENV needs to set up at this point)
npm run tsc
npm start
```

### Client

```
cd graphql_litwitter/client
npm install
(ENV needs to set up at this point)
npm start
```