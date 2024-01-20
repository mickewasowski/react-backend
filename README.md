# Basic Backend

Basic Backend Using TypeScript, Express.js, & MongoDB

## Features:

- Authentication
- Item CRUD

## Technology Stack:

- TypeScript
- Node.js
- Express.js
- MongoDB
- JWT

## Default urls:

### User

- Login User : POST METHOD on localhost:5000/api/user/login 
- Register User : POST METHOD on localhost:5000/api/user/register
- Get All Users : GET METHOD on localhost:5000/api/user (with valid token, received after login)
- Update user : PATCH METHOD on localhost:5000/api/user (with valid token, received after login)

### Item

- Get all items: GET METHOD on localhost:5000/api/item
- Add new item: POST METHOD on localhost:5000/api/item (with valid token, received after login)
- Update item: PATCH METHOD on localhost:5000/api/item (with valid token, received after login)
- Delete item: Delete METHOD on localhost:5000/api/item (with valid token, received after login)

## Usage

### Env Variables

Create a .env file in the root folder of the project and add the following:

```
PORT = 5000
MONGO_URI = your mongodb uri the default is: mongodb://127.0.0.1:27017 
JWT_SECRET = 'abc123' (change this)

```

### Install Dependencies

```
npm install

```

### Seed users and recepies

```
npm run seedDB

```

### Run App

```
# Run MongoDB
linux: sudo systemctl start mongod

# Run in dev mode
npm run server

```

## Testing

There is a postman collection in the root folder: BasicBackend.postman_collection.json.

### Usage

- import using postman
- update the authorization header with the bearertoken received after logging in where appropriate

