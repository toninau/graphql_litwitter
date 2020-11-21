# Lite Twitter

> All the basic functionalities work, a lighter version of twitter.

Lite Twitter is minimal twitter clone where you can:
1. Create an account or log in to existing account
2. Read all messages or just one user's messages
3. Send messages
4. Update profile information

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

## Server

Server provides GraphQL API. Server uses express, typeorm, typegraphql, apollo-server-express, argon2 and jsonwebtoken.