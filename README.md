# Flash Card API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
All endpoints except `/auth/register`, `/auth/login`, `/auth/refresh-token`, and `/auth/validate-token` require a valid JWT token in the Authorization header.

### Headers
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

## 1. Authentication & User Management

### Register User
- **Method**: `POST /auth/register`
- **Body**:
  ```json
  {
    "fullName": "John Doe",
    "userName": "johndoe",
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Response** (201):
  ```json
  {
    "message": "User registered successfully",
    "user": {
      "id": "user-uuid",
      "fullName": "John Doe",
      "userName": "johndoe",
      "email": "john@example.com",
      "avatarUrl": null
    }
  }
  ```
- **Errors**:
  - 400: User with this email or username already exists
  - 500: Server error

### Login
- **Method**: `POST /auth/login`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Response** (200):
  ```json
  {
    "message": "Login successful",
    "accessToken": "jwt-token",
    "user": {
      "id": "user-uuid",
      "fullName": "John Doe",
      "userName": "johndoe",
      "email": "john@example.com",
      "avatarUrl": null
    }
  }
  ```
- **Cookies**: Sets HTTP-only refresh token cookie
- **Errors**:
  - 401: Invalid credentials
  - 500: Server error

### Refresh Token
- **Method**: `POST /auth/refresh-token`
- **Headers**: Requires refresh token in cookie
- **Response** (200):
  ```json
  {
    "accessToken": "new-jwt-token"
  }
  ```
- **Errors**:
  - 401: Invalid refresh token
  - 500: Server error

### Validate Token
- **Method**: `POST /auth/validate-token`
- **Headers**: 
  ```
  Authorization: Bearer <your_token>
  ```
- **Response** (200):
  ```json
  {
    "valid": true,
    "user": {
      "id": "user-uuid",
      "email": "john@example.com"
    }
  }
  ```
- **Errors**:
  - 401: Invalid token

### Get Current User
- **Method**: `GET /auth/me`
- **Headers**: Requires JWT token
- **Response** (200):
  ```json
  {
    "id": "user-uuid",
    "fullName": "John Doe",
    "userName": "johndoe",
    "email": "john@example.com",
    "avatarUrl": null,
    "createdAt": "2024-03-15T10:00:00.000Z"
  }
  ```
- **Errors**:
  - 401: Unauthorized
  - 404: User not found

### Update Profile
- **Method**: `PUT /auth/profile`
- **Headers**: Requires JWT token
- **Body**:
  ```json
  {
    "fullName": "John Updated",
    "userName": "johnupdated",
    "email": "john.updated@example.com",
    "avatarUrl": "https://example.com/avatar.jpg"
  }
  ```
- **Response** (200):
  ```json
  {
    "message": "Profile updated successfully",
    "user": {
      "id": "user-uuid",
      "fullName": "John Updated",
      "userName": "johnupdated",
      "email": "john.updated@example.com",
      "avatarUrl": "https://example.com/avatar.jpg"
    }
  }
  ```
- **Errors**:
  - 400: Username or email already taken
  - 401: Unauthorized
  - 404: User not found

### Change Password
- **Method**: `PUT /auth/change-password`
- **Headers**: Requires JWT token
- **Body**:
  ```json
  {
    "currentPassword": "oldpassword",
    "newPassword": "newpassword"
  }
  ```
- **Response** (200):
  ```json
  {
    "message": "Password updated successfully"
  }
  ```
- **Errors**:
  - 400: Invalid current password
  - 401: Unauthorized
  - 404: User not found

### Logout
- **Method**: `POST /auth/logout`
- **Headers**: Requires JWT token
- **Response** (200):
  ```json
  {
    "message": "Logged out successfully"
  }
  ```
- **Cookies**: Clears refresh token cookie
- **Errors**:
  - 400: No refresh token found
  - 401: Unauthorized

### Get User Profile
- **Method**: `GET /auth/:userId`
- **Headers**: Requires JWT token
- **Response** (200):
  ```json
  {
    "id": "user-uuid",
    "userName": "johndoe",
    "fullName": "John Doe",
    "avatarUrl": null,
    "createdAt": "2024-03-15T10:00:00.000Z"
  }
  ```
- **Errors**:
  - 400: Invalid user ID format
  - 401: Unauthorized
  - 404: User not found

## 2. Decks Management

### Create Deck
- **Method**: `POST /decks`
- **Headers**: Requires JWT token
- **Body**:
  ```json
  {
    "title": "My Deck",
    "description": "Description of my deck",
    "isPublic": false
  }
  ```
- **Response** (201):
  ```json
  {
    "status": "success",
    "data": {
      "id": "deck-uuid",
      "title": "My Deck",
      "description": "Description of my deck",
      "isPublic": false,
      "userId": "user-uuid",
      "createdAt": "2024-03-15T10:00:00.000Z"
    }
  }
  ```
- **Errors**:
  - 400: Missing required fields
  - 401: Unauthorized
  - 500: Server error

### Get All Decks
- **Method**: `GET /decks`
- **Headers**: Requires JWT token
- **Response** (200):
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": "deck-uuid",
        "title": "My Deck",
        "description": "Description",
        "isPublic": false,
        "cardCount": 10,
        "author": {
          "id": "user-uuid",
          "userName": "johndoe",
          "fullName": "John Doe"
        }
      }
    ]
  }
  ```
- **Errors**:
  - 401: Unauthorized
  - 500: Server error

### Get User's Own Decks
- **Method**: `GET /decks/own`
- **Headers**: Requires JWT token
- **Response** (200):
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": "deck-uuid",
        "title": "My Deck",
        "description": "Description",
        "isPublic": false,
        "cardCount": 10
      }
    ]
  }
  ```
- **Errors**:
  - 401: Unauthorized
  - 500: Server error

### Get Single Deck
- **Method**: `GET /decks/:deckId`
- **Headers**: Requires JWT token
- **Response** (200):
  ```json
  {
    "status": "success",
    "data": {
      "id": "deck-uuid",
      "title": "My Deck",
      "description": "Description",
      "isPublic": false,
      "Cards": [
        {
          "id": "card-uuid",
          "question": "Question?",
          "answer": "Answer"
        }
      ],
      "User": {
        "id": "user-uuid",
        "fullName": "John Doe",
        "userName": "johndoe"
      }
    }
  }
  ```
- **Errors**:
  - 401: Unauthorized
  - 404: Deck not found
  - 500: Server error

### Update Deck
- **Method**: `PUT /decks/:deckId`
- **Headers**: Requires JWT token
- **Body**:
  ```json
  {
    "name": "Updated Deck",
    "sourceLanguage": "en",
    "targetLanguage": "es"
  }
  ```
- **Response** (200):
  ```json
  {
    "status": "success",
    "data": {
      "id": "deck-uuid",
      "name": "Updated Deck",
      "sourceLanguage": "en",
      "targetLanguage": "es"
    }
  }
  ```
- **Errors**:
  - 401: Unauthorized
  - 404: Deck not found
  - 500: Server error

### Delete Deck
- **Method**: `DELETE /decks/:deckId`
- **Headers**: Requires JWT token
- **Response** (200):
  ```json
  {
    "status": "success",
    "message": "Deck deleted successfully"
  }
  ```
- **Errors**:
  - 401: Unauthorized
  - 404: Deck not found
  - 500: Server error

### Get Recent Decks
- **Method**: `GET /decks/recent`
- **Headers**: Requires JWT token
- **Query Parameters**:
  - `limit`: Number of decks to return (default: 5)
- **Response** (200):
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": "deck-uuid",
        "title": "Recent Deck",
        "description": "Description",
        "lastStudiedAt": "2024-03-15T10:00:00.000Z"
      }
    ]
  }
  ```
- **Errors**:
  - 401: Unauthorized
  - 500: Server error

### Search Decks
- **Method**: `GET /decks/search`
- **Headers**: Requires JWT token
- **Query Parameters**:
  - `query`: Search term
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
- **Response** (200):
  ```json
  {
    "status": "success",
    "data": {
      "decks": [
        {
          "id": "deck-uuid",
          "title": "Found Deck",
          "description": "Description",
          "author": {
            "id": "user-uuid",
            "userName": "johndoe"
          }
        }
      ],
      "total": 1,
      "page": 1,
      "limit": 10
    }
  }
  ```
- **Errors**:
  - 401: Unauthorized
  - 500: Server error

## 3. Cards Management

### Create Card
- **Method**: `POST /decks/:deckId/cards`
- **Headers**: Requires JWT token
- **Body**:
  ```json
  {
    "question": "What is...?",
    "answer": "It is..."
  }
  ```
- **Response** (201):
  ```json
  {
    "status": "success",
    "data": {
      "id": "card-uuid",
      "question": "What is...?",
      "answer": "It is...",
      "deckId": "deck-uuid"
    }
  }
  ```
- **Errors**:
  - 400: Missing required fields
  - 401: Unauthorized
  - 404: Deck not found
  - 500: Server error

### Get Deck Cards
- **Method**: `GET /decks/:deckId/cards`
- **Headers**: Requires JWT token
- **Response** (200):
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": "card-uuid",
        "question": "What is...?",
        "answer": "It is..."
      }
    ]
  }
  ```
- **Errors**:
  - 401: Unauthorized
  - 404: Deck not found
  - 500: Server error

### Get Single Card
- **Method**: `GET /decks/:deckId/cards/:cardId`
- **Headers**: Requires JWT token
- **Response** (200):
  ```json
  {
    "status": "success",
    "data": {
      "id": "card-uuid",
      "question": "What is...?",
      "answer": "It is..."
    }
  }
  ```
- **Errors**:
  - 401: Unauthorized
  - 404: Card not found
  - 500: Server error

### Update Card
- **Method**: `PUT /decks/:deckId/cards/:cardId`
- **Headers**: Requires JWT token
- **Body**:
  ```json
  {
    "question": "Updated question?",
    "answer": "Updated answer"
  }
  ```
- **Response** (200):
  ```json
  {
    "status": "success",
    "data": {
      "id": "card-uuid",
      "question": "Updated question?",
      "answer": "Updated answer"
    }
  }
  ```
- **Errors**:
  - 401: Unauthorized
  - 404: Card not found
  - 500: Server error

### Delete Card
- **Method**: `DELETE /decks/:deckId/cards/:cardId`
- **Headers**: Requires JWT token
- **Response** (200):
  ```json
  {
    "status": "success",
    "message": "Card deleted successfully"
  }
  ```
- **Errors**:
  - 401: Unauthorized
  - 404: Card not found
  - 500: Server error

## 4. Study Sessions

### Start Session
- **Method**: `POST /study-sessions/start`
- **Headers**: Requires JWT token
- **Body**:
  ```json
  {
    "deckId": "deck-uuid"
  }
  ```
- **Response** (201):
  ```json
  {
    "session": {
      "id": "session-uuid",
      "userId": "user-uuid",
      "deckId": "deck-uuid",
      "totalCards": 10,
      "correctAnswers": 0,
      "incorrectAnswers": 0,
      "currentCardIndex": 0,
      "sessionProgress": 0,
      "startTime": "2024-03-15T10:00:00.000Z",
      "isCompleted": false
    },
    "deckProgress": {
      "id": "progress-uuid",
      "userId": "user-uuid",
      "deckId": "deck-uuid",
      "totalCards": 10,
      "masteredCards": 0,
      "completionPercentage": 0,
      "totalStudyTime": 0,
      "totalSessions": 1,
      "averageAccuracy": 0,
      "lastStudiedAt": "2024-03-15T10:00:00.000Z"
    }
  }
  ```
- **Errors**:
  - 400: Invalid input data
  - 401: Unauthorized
  - 404: Deck not found
  - 500: Server error

### Update Card Status
- **Method**: `POST /study-sessions/update-card`
- **Headers**: Requires JWT token
- **Body**:
  ```json
  {
    "sessionId": "session-uuid",
    "cardId": "card-uuid",
    "isCorrect": true
  }
  ```
- **Response** (200):
  ```json
  {
    "session": {
      "id": "session-uuid",
      "correctAnswers": 1,
      "incorrectAnswers": 0,
      "currentCardIndex": 1,
      "sessionProgress": 10
    },
    "deckProgress": {
      "id": "progress-uuid",
      "masteredCards": 1,
      "completionPercentage": 10,
      "lastStudiedAt": "2024-03-15T10:00:00.000Z"
    }
  }
  ```
- **Errors**:
  - 400: Invalid input data
  - 401: Unauthorized
  - 404: Session not found
  - 500: Server error

### End Session
- **Method**: `POST /study-sessions/end/:sessionId`
- **Headers**: Requires JWT token
- **Response** (200):
  ```json
  {
    "sessionStats": {
      "totalCards": 10,
      "correctAnswers": 8,
      "incorrectAnswers": 2,
      "accuracy": 80,
      "studyTime": 15,
      "deckProgress": {
        "id": "progress-uuid",
        "totalStudyTime": 15,
        "totalSessions": 1,
        "averageAccuracy": 80
      }
    }
  }
  ```
- **Errors**:
  - 401: Unauthorized
  - 404: Session not found
  - 500: Server error

### Get Current Session
- **Method**: `GET /study-sessions/current/:deckId`
- **Headers**: Requires JWT token
- **Response** (200):
  ```json
  {
    "session": {
      "id": "session-uuid",
      "userId": "user-uuid",
      "deckId": "deck-uuid",
      "totalCards": 10,
      "correctAnswers": 5,
      "incorrectAnswers": 2,
      "currentCardIndex": 7,
      "sessionProgress": 50,
      "startTime": "2024-03-15T10:00:00.000Z",
      "isCompleted": false,
      "UserCardAnswers": [
        {
          "id": "answer-uuid",
          "cardId": "card-uuid",
          "isCorrect": true,
          "createdAt": "2024-03-15T10:00:00.000Z",
          "Card": {
            "id": "card-uuid",
            "question": "What is...?",
            "answer": "It is..."
          }
        }
      ]
    }
  }
  ```
- **Errors**:
  - 401: Unauthorized
  - 404: Active session not found
  - 500: Server error

## 5. Card Answers

### Submit Answer
- **Method**: `POST /decks/:deckId/cards/:cardId/answers`
- **Headers**: Requires JWT token
- **Body**:
  ```json
  {
    "userAnswer": "User's answer"
  }
  ```
- **Response** (200):
  ```json
  {
    "status": "success",
    "data": {
      "id": "answer-uuid",
      "userId": "user-uuid",
      "cardId": "card-uuid",
      "userAnswer": "User's answer",
      "isCorrect": true,
      "correctAnswer": "Correct answer"
    }
  }
  ```
- **Errors**:
  - 400: Missing user answer
  - 401: Unauthorized
  - 404: Card not found
  - 500: Server error

### Get User's Answer
- **Method**: `GET /decks/:deckId/cards/:cardId/answers`
- **Headers**: Requires JWT token
- **Response** (200):
  ```json
  {
    "status": "success",
    "data": {
      "id": "answer-uuid",
      "userId": "user-uuid",
      "cardId": "card-uuid",
      "userAnswer": "User's answer",
      "isCorrect": true,
      "createdAt": "2024-03-15T10:00:00.000Z"
    }
  }
  ```
- **Errors**:
  - 401: Unauthorized
  - 404: Card not found
  - 500: Server error

### Get Deck Answers
- **Method**: `GET /decks/:deckId/answers`
- **Headers**: Requires JWT token
- **Response** (200):
  ```json
  {
    "status": "success",
    "data": {
      "cards": [
        {
          "id": "card-uuid",
          "question": "What is...?",
          "answer": "It is...",
          "UserCardAnswer": {
            "id": "answer-uuid",
            "userAnswer": "User's answer",
            "isCorrect": true
          }
        }
      ],
      "statistics": {
        "totalCards": 10,
        "answeredCards": 5,
        "correctAnswers": 4,
        "accuracy": 80
      }
    }
  }
  ```
- **Errors**:
  - 401: Unauthorized
  - 404: Deck not found
  - 500: Server error

### Get User Answer Statistics
- **Method**: `GET /answers/stats`
- **Headers**: Requires JWT token
- **Query Parameters**:
  - `timeRange`: 'day', 'week', 'month', 'all' (optional)
- **Response** (200):
  ```json
  {
    "status": "success",
    "data": {
      "overallStats": {
        "totalAnswers": 100,
        "correctAnswers": 80,
        "accuracy": 80
      },
      "deckStats": [
        {
          "deckId": "deck-uuid",
          "deckTitle": "My Deck",
          "totalAnswers": 50,
          "correctAnswers": 40,
          "accuracy": 80
        }
      ]
    }
  }
  ```
- **Errors**:
  - 401: Unauthorized
  - 500: Server error

## 6. Deck Ratings

### Rate Deck
- **Method**: `POST /decks/:deckId/ratings`
- **Headers**: Requires JWT token
- **Body**:
  ```json
  {
    "isLike": true
  }
  ```
- **Response** (200):
  ```json
  {
    "status": "success",
    "data": {
      "id": "rating-uuid",
      "userId": "user-uuid",
      "deckId": "deck-uuid",
      "isLike": true
    }
  }
  ```
- **Errors**:
  - 400: Invalid rating value
  - 401: Unauthorized
  - 404: Deck not found
  - 500: Server error

### Get Deck Ratings
- **Method**: `GET /decks/:deckId/ratings`
- **Headers**: Requires JWT token
- **Response** (200):
  ```json
  {
    "status": "success",
    "data": {
      "ratings": [
        {
          "id": "rating-uuid",
          "userId": "user-uuid",
          "isLike": true,
          "User": {
            "id": "user-uuid",
            "userName": "johndoe"
          }
        }
      ],
      "likes": 10,
      "dislikes": 2,
      "totalRatings": 12
    }
  }
  ```
- **Errors**:
  - 401: Unauthorized
  - 404: Deck not found
  - 500: Server error

### Get User's Rating
- **Method**: `GET /decks/:deckId/ratings/user`
- **Headers**: Requires JWT token
- **Response** (200):
  ```json
  {
    "status": "success",
    "data": {
      "id": "rating-uuid",
      "userId": "user-uuid",
      "deckId": "deck-uuid",
      "isLike": true
    }
  }
  ```
- **Errors**:
  - 401: Unauthorized
  - 404: Deck not found
  - 500: Server error

### Delete Rating
- **Method**: `DELETE /decks/:deckId/ratings`
- **Headers**: Requires JWT token
- **Response** (200):
  ```json
  {
    "status": "success",
    "message": "Rating deleted successfully"
  }
  ```
- **Errors**:
  - 401: Unauthorized
  - 404: Rating not found
  - 500: Server error

## Error Responses

All endpoints may return the following errors:

- **400 Bad Request**
  ```json
  {
    "status": "error",
    "message": "Invalid input data",
    "details": {
      "field": "error description"
    }
  }
  ```

- **401 Unauthorized**
  ```json
  {
    "status": "error",
    "message": "Unauthorized access"
  }
  ```

- **403 Forbidden**
  ```json
  {
    "status": "error",
    "message": "Access denied"
  }
  ```

- **404 Not Found**
  ```json
  {
    "status": "error",
    "message": "Resource not found",
    "details": {
      "resource": "resource identifier"
    }
  }
  ```

- **500 Server Error**
  ```json
  {
    "status": "error",
    "message": "Internal server error"
  }
  ```

## Authentication Flow

1. Register a new user using `/auth/register`
2. Login using `/auth/login` to get access token
3. Include access token in all subsequent requests
4. Use `/auth/refresh-token` to get a new access token when it expires
5. Use `/auth/logout` to end the session

## Study Session Flow

1. Start a session using `/study-sessions/start`
2. For each card:
   - Show the question
   - Get user's answer
   - Update card status using `/study-sessions/update-card`
3. End session using `/study-sessions/end/:sessionId`
4. View session statistics and progress

## Best Practices

1. Always handle token expiration
2. Implement proper error handling
3. Use appropriate HTTP methods
4. Follow RESTful conventions
5. Validate input data
6. Implement rate limiting
7. Use HTTPS in production
8. Keep tokens secure
9. Implement proper session management
10. Follow security best practices 