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

#### Validate Token
```http
POST /api/v1/auth/validate-token
```
Headers:
```
Authorization: Bearer <your_token>
```

#### Get Current User
```http
GET /api/v1/auth/me
```
Headers:
```
Authorization: Bearer <your_token>
```

#### Update Profile
```http
PUT /api/v1/auth/profile
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

#### Change Password
```http
PUT /api/v1/auth/change-password
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

#### Search Decks
```http
GET /api/v1/decks/search
```
Headers:
```
Authorization: Bearer <your_token>
```
Query Parameters:
- `query` (required): Search term to match against deck titles and descriptions

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
      "cardCount": 10,
      "author": {
        "id": "uuid",
        "userName": "johndoe"
      },
      "createdAt": "2024-03-14T12:00:00Z",
      "updatedAt": "2024-03-14T12:00:00Z"
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

#### Get User's Own Decks
```http
GET /api/v1/decks/my-decks
```
Headers:
```
Authorization: Bearer <your_token>
```

#### Get Specific Deck
```http
GET /api/v1/decks/:deckId
```
Headers:
```
Authorization: Bearer <your_token>
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

### Deck Ratings

#### Get All Ratings for a Deck
```http
GET /api/v1/decks/:deckId/ratings
```
Headers:
```
Authorization: Bearer <your_token>
```

#### Rate a Deck
```http
POST /api/v1/decks/:deckId/ratings
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

#### Delete User's Rating
```http
DELETE /api/v1/decks/:deckId/ratings
```
Headers:
```
Authorization: Bearer <your_token>
```

### Cards

#### Get All Cards in a Deck
```http
GET /api/v1/decks/:deckId/cards
```
Headers:
```
Authorization: Bearer <your_token>
```

#### Get Single Card
```http
GET /api/v1/decks/:deckId/cards/:cardId
```
Headers:
```
Authorization: Bearer <your_token>
```

#### Create Card
```http
POST /api/v1/decks/:deckId/cards
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

#### Update Card
```http
PUT /api/v1/decks/:deckId/cards/:cardId
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

#### Delete Card
```http
DELETE /api/v1/decks/:deckId/cards/:cardId
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

#### Get All Answers for a Deck
```http
GET /api/v1/decks/answers/deck/:deckId
```
Headers:
```
Authorization: Bearer <your_token>
```

#### Get User's Answer for a Specific Card
```http
GET /api/v1/decks/answers/deck/:deckId/card/:cardId
```
Headers:
```
Authorization: Bearer <your_token>
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