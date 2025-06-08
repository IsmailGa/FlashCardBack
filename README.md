# Flash Card Backend API

## API Documentation

### Authentication

#### Register User
```http
POST /api/v1/auth/register
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

#### Login
```http
POST /api/v1/auth/login
```
Request body:
```json
{
  "email": "john@example.com",
  "password": "your_password"
}
```
Response includes:
- Access token (valid for 15 minutes)
- Refresh token (stored in HTTP-only cookie, valid for 7 days)

#### Refresh Token
```http
POST /api/v1/auth/refresh-token
```
Headers:
```
Authorization: Bearer <your_token>
```
The refresh token is automatically read from cookies.

#### Validate Token
```http
POST /api/v1/auth/validate-token
```
Headers:
```
Authorization: Bearer <your_token>
```

#### Logout
```http
POST /api/v1/auth/logout
```
Headers:
```
Authorization: Bearer <your_token>
```

### Decks

#### Get Recent Decks
```http
GET /api/v1/decks/recent
```
Headers:
```
Authorization: Bearer <your_token>
```
Query Parameters:
- `limit` (optional): Number of recent decks to return (default: 5)

Response:
```json
{
  "message": "Recent decks retrieved successfully",
  "decks": [
    {
      "id": "uuid",
      "title": "Spanish Vocabulary",
      "description": "Basic Spanish words",
      "lastPlayedAt": "2024-03-14T12:00:00Z",
      "createdAt": "2024-03-14T10:00:00Z",
      "updatedAt": "2024-03-14T10:00:00Z"
    }
  ]
}
```

#### Get All Decks (Public and User's Private)
```http
GET /api/v1/decks
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
      "createdAt": "2024-03-14T12:00:00Z",
      "updatedAt": "2024-03-14T12:00:00Z"
    }
  ]
}
```

#### Get User's Own Decks
```http
GET /api/v1/decks/my-decks
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
      "createdAt": "2024-03-14T12:00:00Z",
      "updatedAt": "2024-03-14T12:00:00Z"
    }
  ]
}
```

#### Get Specific Deck
```http
GET /api/v1/decks/:deckId
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
        "question": "hello",
        "answer": "hola"
      }
    ],
    "createdAt": "2024-03-14T12:00:00Z",
    "updatedAt": "2024-03-14T12:00:00Z"
  }
}
```

#### Create New Deck
```http
POST /api/v1/decks
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

#### Update Deck
```http
PUT /api/v1/decks/:deckId
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

#### Delete Deck
```http
DELETE /api/v1/decks/:deckId
```
Headers:
```
Authorization: Bearer <your_token>
```

### User Card Answers

#### Get User Answer Statistics
```http
GET /api/v1/decks/answers/stats
```
Headers:
```
Authorization: Bearer <your_token>
```
Query Parameters:
- `timeRange` (optional): Filter statistics by time range
  - `day`: Last 24 hours
  - `week`: Last 7 days
  - `month`: Last 30 days
  - `all`: All time (default)

Response:
```json
{
  "status": "success",
  "data": {
    "overall": {
      "totalAnswers": 100,
      "correctAnswers": 75,
      "accuracy": 75.0
    },
    "byDeck": [
      {
        "deckId": "uuid",
        "deckTitle": "Spanish Vocabulary",
        "totalAnswers": 50,
        "correctAnswers": 40,
        "accuracy": 80.0
      }
    ],
    "dailyProgress": [
      {
        "date": "2024-03-14T00:00:00Z",
        "totalAnswers": 20,
        "correctAnswers": 15,
        "accuracy": 75.0
      }
    ],
    "recentAnswers": [
      {
        "id": "uuid",
        "userAnswer": "hola",
        "isCorrect": true,
        "createdAt": "2024-03-14T12:00:00Z",
        "deck": {
          "id": "uuid",
          "title": "Spanish Vocabulary"
        },
        "card": {
          "id": "uuid",
          "question": "hello"
        }
      }
    ]
  }
}
```

#### Get All Answers for a Deck
```http
GET /api/v1/decks/answers/deck/:deckId
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
        "question": "hello",
        "answer": "hola",
        "UserCardAnswer": {
          "id": "uuid",
          "userAnswer": "hola",
          "isCorrect": true,
          "createdAt": "2024-03-14T12:00:00Z"
        }
      }
    ],
    "statistics": {
      "totalCards": 10,
      "answeredCards": 8,
      "correctAnswers": 6,
      "accuracy": 75.0
    }
  }
}
```

#### Get User's Answer for a Specific Card
```http
GET /api/v1/decks/answers/deck/:deckId/card/:cardId
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
    "userAnswer": "hola",
    "isCorrect": true,
    "createdAt": "2024-03-14T12:00:00Z"
  }
}
```

#### Submit an Answer for a Card
```http
POST /api/v1/decks/answers/deck/:deckId/card/:cardId
```
Headers:
```
Authorization: Bearer <your_token>
```
Request body:
```json
{
  "userAnswer": "hola"
}
```
Response:
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "userAnswer": "hola",
    "isCorrect": true,
    "createdAt": "2024-03-14T12:00:00Z",
    "correctAnswer": "hola"
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