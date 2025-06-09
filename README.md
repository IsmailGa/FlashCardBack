# Flash Card API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
All endpoints except login and register require a valid JWT token in the Authorization header.

### Register
- **Method**: `POST /auth/register`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Request Body**:
  ```json
  {
    "userName": "johndoe",
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "user-uuid",
      "userName": "johndoe",
      "fullName": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-03-15T10:00:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - 400: Invalid input data
  - 409: Username or email already exists

### Login
- **Method**: `POST /auth/login`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "user-uuid",
      "userName": "johndoe",
      "fullName": "John Doe",
      "email": "john@example.com",
      "token": "jwt-token",
      "refreshToken": "refresh-token"
    }
  }
  ```
- **Error Responses**:
  - 400: Invalid credentials
  - 401: Authentication failed

### Get User Profile
- **Method**: `GET /auth/:userId`
- **Headers**: 
  ```
  Authorization: Bearer <your_token>
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "user-uuid",
      "userName": "johndoe",
      "fullName": "John Doe",
      "avatarUrl": "https://example.com/avatar.jpg",
      "createdAt": "2024-03-15T10:00:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - 404: User not found
  - 401: Unauthorized

## Decks

### Get All Decks (Including Author Info)
- **Method**: `GET /decks`
- **Headers**: 
  ```
  Authorization: Bearer <your_token>
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": "deck-uuid",
        "title": "Spanish Basics",
        "description": "Basic Spanish vocabulary",
        "isPublic": true,
        "cardCount": 10,
        "author": {
          "id": "user-uuid",
          "userName": "johndoe",
          "fullName": "John Doe"
        },
        "createdAt": "2024-03-15T10:00:00.000Z"
      }
    ]
  }
  ```
- **Error Responses**:
  - 401: Unauthorized
  - 500: Server error

### Get User's Own Decks
- **Method**: `GET /decks/own`
- **Headers**: 
  ```
  Authorization: Bearer <your_token>
  ```
- **Response**: Same as Get All Decks
- **Error Responses**:
  - 401: Unauthorized
  - 500: Server error

### Get User's Public Decks
- **Method**: `GET /decks/user/:userId`
- **Headers**: 
  ```
  Authorization: Bearer <your_token>
  ```
- **Response**: Same as Get All Decks
- **Error Responses**:
  - 404: User not found
  - 401: Unauthorized
  - 500: Server error

### Get Deck by ID
- **Method**: `GET /decks/:deckId`
- **Headers**: 
  ```
  Authorization: Bearer <your_token>
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "deck-uuid",
      "title": "Spanish Basics",
      "description": "Basic Spanish vocabulary",
      "isPublic": true,
      "cardCount": 10,
      "author": {
        "id": "user-uuid",
        "userName": "johndoe",
        "fullName": "John Doe"
      },
      "cards": [
        {
          "id": "card-uuid",
          "question": "What is hello in Spanish?",
          "answer": "Hola"
        }
      ],
      "createdAt": "2024-03-15T10:00:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - 404: Deck not found
  - 401: Unauthorized
  - 500: Server error

### Create Deck
- **Method**: `POST /decks`
- **Headers**: 
  ```
  Authorization: Bearer <your_token>
  Content-Type: application/json
  ```
- **Request Body**:
  ```json
  {
    "title": "Spanish Basics",
    "description": "Basic Spanish vocabulary",
    "isPublic": true,
    "cards": [
      {
        "question": "What is hello in Spanish?",
        "answer": "Hola"
      }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "deck-uuid",
      "title": "Spanish Basics",
      "description": "Basic Spanish vocabulary",
      "isPublic": true,
      "cardCount": 1,
      "author": {
        "id": "user-uuid",
        "userName": "johndoe",
        "fullName": "John Doe"
      },
      "createdAt": "2024-03-15T10:00:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - 400: Invalid input data
  - 401: Unauthorized
  - 500: Server error

### Update Deck
- **Method**: `PUT /decks/:deckId`
- **Headers**: 
  ```
  Authorization: Bearer <your_token>
  Content-Type: application/json
  ```
- **Request Body**:
  ```json
  {
    "title": "Updated Spanish Basics",
    "description": "Updated description",
    "isPublic": true
  }
  ```
- **Response**: Same as Get Deck by ID
- **Error Responses**:
  - 404: Deck not found
  - 403: Not authorized to update this deck
  - 401: Unauthorized
  - 500: Server error

### Delete Deck
- **Method**: `DELETE /decks/:deckId`
- **Headers**: 
  ```
  Authorization: Bearer <your_token>
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Deck deleted successfully"
  }
  ```
- **Error Responses**:
  - 404: Deck not found
  - 403: Not authorized to delete this deck
  - 401: Unauthorized
  - 500: Server error

## Card Progress Tracking

### Update Card Progress
- **Method**: `POST /decks/:deckId/cards/:cardId/progress`
- **Headers**: 
  ```
  Authorization: Bearer <your_token>
  Content-Type: application/json
  ```
- **Request Body**:
  ```json
  {
    "isCorrect": true  // true if user knows the answer, false if still learning
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "progress-uuid",
      "userId": "user-uuid",
      "cardId": "card-uuid",
      "status": "know",  // or "learning"
      "nextReview": "2024-03-20T10:00:00.000Z",
      "reviewCount": 1,
      "card": {
        "id": "card-uuid",
        "question": "What is hello in Spanish?",
        "answer": "Hola"
      }
    }
  }
  ```
- **Error Responses**:
  - 404: Deck or card not found
  - 400: Invalid input data
  - 401: Unauthorized
  - 500: Server error

### Get User's Card Progress
- **Method**: `GET /decks/:deckId/progress`
- **Headers**: 
  ```
  Authorization: Bearer <your_token>
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "deckId": "deck-uuid",
      "totalCards": 10,
      "progress": [
        {
          "cardId": "card-uuid",
          "status": "know",
          "nextReview": "2024-03-20T10:00:00.000Z",
          "reviewCount": 3,
          "card": {
            "id": "card-uuid",
            "question": "What is hello in Spanish?",
            "answer": "Hola"
          }
        }
      ],
      "summary": {
        "totalCards": 10,
        "knownCards": 5,
        "learningCards": 5,
        "completionPercentage": 50
      }
    }
  }
  ```
- **Error Responses**:
  - 404: Deck not found
  - 401: Unauthorized
  - 500: Server error

## Progress Tracking System

The system tracks your learning progress with a simple two-state system:

1. **Status**:
   - `learning`: When you don't know the answer yet
   - `know`: When you know the answer

2. **Review Schedule**:
   - Learning cards: Review after 1 day
   - Known cards: Review after 7 days

3. **How it works**:
   - When you answer a card:
     - If correct: Status changes to "know", next review in 7 days
     - If incorrect: Status changes to "learning", next review in 1 day
   - The system keeps track of how many times you've reviewed each card

4. **Progress Monitoring**:
   - Track how many times you've reviewed each card
   - See which cards you know and which ones you're still learning
   - Monitor your learning journey with simple status tracking
   - Get progress summaries for each deck

5. **Multiple Users Learning**:
   - Each user's progress is tracked independently
   - Users can learn from each other's public decks
   - Progress is saved per user-card combination
   - Review schedules are personalized for each user

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