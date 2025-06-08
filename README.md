# Flash Card API Documentation

## Setup & Configuration

1. **Database Configuration**
   - The server uses a `config/config.js` file for Sequelize database configuration.
   - Example `config/config.js`:
     ```js
     module.exports = {
       development: {
         username: "postgres",
         password: "your_password",
         database: "flash_card_db",
         host: "127.0.0.1",
         dialect: "postgres"
       },
       test: {
         username: "postgres",
         password: "your_password",
         database: "flash_card_db_test",
         host: "127.0.0.1",
         dialect: "postgres"
       },
       production: {
         username: "postgres",
         password: "your_password",
         database: "flash_card_db_prod",
         host: "127.0.0.1",
         dialect: "postgres"
       }
     };
     ```
   - Make sure your database credentials match your local setup.

2. **Environment Variables**
   - Create a `.env` file in the project root with at least:
     ```env
     JWT_SECRET=your_jwt_secret
     ```

3. **Database Migration**
   - Run migrations to set up the database tables:
     ```sh
     npx sequelize-cli db:migrate
     ```

4. **Start the Server**
   - Use `npm start` or `nodemon` to run the server.

---

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
```
Request body:
```json
{
  "fullName": "John Doe",
  "userName": "johndoe",
  "email": "john@example.com",
  "password": "your_password"
}
```
Response:
```json
{
  "message": "User registered successfully",
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "fullName": "John Doe",
    "userName": "johndoe",
    "email": "john@example.com",
    "avatarUrl": null
  }
}
```

#### Login
```http
POST /auth/login
```
Request body:
```json
{
  "email": "john@example.com",
  "password": "your_password"
}
```
Response:
```json
{
  "message": "Login successful",
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "fullName": "John Doe",
    "userName": "johndoe",
    "email": "john@example.com",
    "avatarUrl": null
  }
}
```

#### Logout
```http
POST /auth/logout
```
Headers:
```
Authorization: Bearer <your_token>
```
Response:
```json
{
  "message": "Logged out successfully"
}
```

#### Get Current User
```http
GET /auth/me
```
Headers:
```
Authorization: Bearer <your_token>
```
Response:
```json
{
  "id": "uuid",
  "fullName": "John Doe",
  "userName": "johndoe",
  "email": "john@example.com",
  "avatarUrl": null,
  "createdAt": "2024-03-07T12:00:00.000Z",
  "updatedAt": "2024-03-07T12:00:00.000Z"
}
```

#### Update Profile
```http
PUT /auth/profile
```
Headers:
```
Authorization: Bearer <your_token>
```
Request body:
```json
{
  "fullName": "John Updated",
  "userName": "johnupdated",
  "email": "john.updated@example.com",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```
Response:
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "uuid",
    "fullName": "John Updated",
    "userName": "johnupdated",
    "email": "john.updated@example.com",
    "avatarUrl": "https://example.com/avatar.jpg"
  }
}
```

#### Change Password
```http
PUT /auth/change-password
```
Headers:
```
Authorization: Bearer <your_token>
```
Request body:
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```
Response:
```json
{
  "message": "Password changed successfully"
}
```

### Decks

#### Get All Decks (Public and User's Private)
```http
GET /decks
```
Headers:
```
Authorization: Bearer <your_token>
```
Response:
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "title": "Spanish Vocabulary",
      "description": "Basic Spanish words",
      "isPublic": true,
      "userId": "uuid",
      "cardCount": 10,
      "createdAt": "2024-03-07T12:00:00.000Z",
      "updatedAt": "2024-03-07T12:00:00.000Z"
    }
  ]
}
```

#### Get User's Own Decks Only
```http
GET /decks/my-decks
```
Headers:
```
Authorization: Bearer <your_token>
```
Response:
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "title": "Spanish Vocabulary",
      "description": "Basic Spanish words",
      "isPublic": true,
      "userId": "uuid",
      "cardCount": 10,
      "createdAt": "2024-03-07T12:00:00.000Z",
      "updatedAt": "2024-03-07T12:00:00.000Z"
    }
  ]
}
```

#### Get Single Deck
```http
GET /decks/:deckId
```
Headers:
```
Authorization: Bearer <your_token>
```
Response:
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "title": "Spanish Vocabulary",
    "description": "Basic Spanish words",
    "isPublic": true,
    "userId": "uuid",
    "Cards": [
      {
        "id": "uuid",
        "question": "Hello",
        "answer": "Hola"
      }
    ],
    "createdAt": "2024-03-07T12:00:00.000Z",
    "updatedAt": "2024-03-07T12:00:00.000Z"
  }
}
```

#### Create Deck
```http
POST /decks
```
Headers:
```
Authorization: Bearer <your_token>
```
Request body:
```json
{
  "title": "Spanish Vocabulary",
  "description": "Basic Spanish words",
  "isPublic": true
}
```
Response:
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "title": "Spanish Vocabulary",
    "description": "Basic Spanish words",
    "isPublic": true,
    "userId": "uuid",
    "createdAt": "2024-03-07T12:00:00.000Z",
    "updatedAt": "2024-03-07T12:00:00.000Z"
  }
}
```

#### Update Deck
```http
PUT /decks/:deckId
```
Headers:
```
Authorization: Bearer <your_token>
```
Request body:
```json
{
  "title": "Updated Spanish Vocabulary",
  "description": "Updated description",
  "isPublic": false
}
```
Response:
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "title": "Updated Spanish Vocabulary",
    "description": "Updated description",
    "isPublic": false,
    "userId": "uuid",
    "createdAt": "2024-03-07T12:00:00.000Z",
    "updatedAt": "2024-03-07T12:00:00.000Z"
  }
}
```

#### Delete Deck
```http
DELETE /decks/:deckId
```
Headers:
```
Authorization: Bearer <your_token>
```
Response:
```json
{
  "status": "success",
  "message": "Deck deleted successfully"
}
```

### Cards

#### Get All Cards in Deck
```http
GET /decks/:deckId/cards
```
Headers:
```
Authorization: Bearer <your_token>
```
Response:
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "question": "Hello",
      "answer": "Hola",
      "deckId": "uuid",
      "createdAt": "2024-03-07T12:00:00.000Z",
      "updatedAt": "2024-03-07T12:00:00.000Z"
    }
  ]
}
```

#### Get Single Card
```http
GET /decks/:deckId/cards/:cardId
```
Headers:
```
Authorization: Bearer <your_token>
```
Response:
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "question": "Hello",
    "answer": "Hola",
    "deckId": "uuid",
    "createdAt": "2024-03-07T12:00:00.000Z",
    "updatedAt": "2024-03-07T12:00:00.000Z"
  }
}
```

#### Create Card
```http
POST /decks/:deckId/cards
```
Headers:
```
Authorization: Bearer <your_token>
```
Request body:
```json
{
  "question": "Good morning",
  "answer": "Buenos días"
}
```
Response:
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "question": "Good morning",
    "answer": "Buenos días",
    "deckId": "uuid",
    "createdAt": "2024-03-07T12:00:00.000Z",
    "updatedAt": "2024-03-07T12:00:00.000Z"
  }
}
```

#### Update Card
```http
PUT /decks/:deckId/cards/:cardId
```
Headers:
```
Authorization: Bearer <your_token>
```
Request body:
```json
{
  "question": "Updated question",
  "answer": "Updated answer"
}
```
Response:
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "question": "Updated question",
    "answer": "Updated answer",
    "deckId": "uuid",
    "createdAt": "2024-03-07T12:00:00.000Z",
    "updatedAt": "2024-03-07T12:00:00.000Z"
  }
}
```

#### Delete Card
```http
DELETE /decks/:deckId/cards/:cardId
```
Headers:
```
Authorization: Bearer <your_token>
```
Response:
```json
{
  "status": "success",
  "message": "Card deleted successfully"
}
```

### Deck Ratings

#### Get All Ratings for Deck
```http
GET /decks/:deckId/ratings
```
Headers:
```
Authorization: Bearer <your_token>
```
Response:
```json
{
  "status": "success",
  "data": {
    "ratings": [
      {
        "id": "uuid",
        "isLike": true,
        "userId": "uuid",
        "deckId": "uuid",
        "User": {
          "id": "uuid",
          "userName": "johndoe"
        }
      }
    ],
    "likes": 5,
    "dislikes": 2,
    "totalRatings": 7
  }
}
```

#### Get User's Rating
```http
GET /decks/:deckId/ratings/my-rating
```
Headers:
```
Authorization: Bearer <your_token>
```
Response:
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "isLike": true,
    "userId": "uuid",
    "deckId": "uuid",
    "createdAt": "2024-03-07T12:00:00.000Z",
    "updatedAt": "2024-03-07T12:00:00.000Z"
  }
}
```

#### Rate Deck
```http
POST /decks/:deckId/ratings
```
Headers:
```
Authorization: Bearer <your_token>
```
Request body:
```json
{
  "isLike": true
}
```
Response:
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "isLike": true,
    "userId": "uuid",
    "deckId": "uuid",
    "createdAt": "2024-03-07T12:00:00.000Z",
    "updatedAt": "2024-03-07T12:00:00.000Z"
  }
}
```

#### Delete Rating
```http
DELETE /decks/:deckId/ratings
```
Headers:
```
Authorization: Bearer <your_token>
```
Response:
```json
{
  "status": "success",
  "message": "Rating deleted successfully"
}
```

### User Card Answers

#### Get All Answers for Deck
```http
GET /decks/:deckId/answers
```
Headers:
```
Authorization: Bearer <your_token>
```
Response:
```json
{
  "status": "success",
  "data": {
    "cards": [
      {
        "id": "uuid",
        "question": "Hello",
        "answer": "Hola",
        "UserCardAnswer": {
          "id": "uuid",
          "userAnswer": "Hola",
          "isCorrect": true
        }
      }
    ],
    "statistics": {
      "totalCards": 10,
      "answeredCards": 5,
      "correctAnswers": 3,
      "accuracy": 60
    }
  }
}
```

#### Submit Answer
```http
POST /decks/:deckId/answers/cards/:cardId/answer
```
Headers:
```
Authorization: Bearer <your_token>
```
Request body:
```json
{
  "userAnswer": "Hola"
}
```
Response:
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "userAnswer": "Hola",
    "isCorrect": true,
    "correctAnswer": "Hola"
  }
}
```

#### Get User's Answer
```http
GET /decks/:deckId/answers/cards/:cardId/answer
```
Headers:
```
Authorization: Bearer <your_token>
```
Response:
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "userAnswer": "Hola",
    "isCorrect": true,
    "createdAt": "2024-03-07T12:00:00.000Z",
    "updatedAt": "2024-03-07T12:00:00.000Z"
  }
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Error message here"
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized access"
}
```

### 403 Forbidden
```json
{
  "message": "User not found"
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Error message here",
  "error": "Detailed error message"
}
``` 