# Flash Card API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Authentication
All endpoints except login, register, and refresh-token require a valid JWT token in the Authorization header.

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

### Refresh Token
- **Method**: `POST /auth/refresh-token`
- **Headers**: 
  ```
  Authorization: Bearer <your_refresh_token>
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "token": "new-jwt-token",
      "refreshToken": "new-refresh-token"
    }
  }
  ```
- **Error Responses**:
  - 401: Invalid refresh token

### Validate Token
- **Method**: `POST /auth/validate-token`
- **Headers**: 
  ```
  Authorization: Bearer <your_token>
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "valid": true
    }
  }
  ```
- **Error Responses**:
  - 401: Invalid token

### Get Current User
- **Method**: `GET /auth/me`
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
      "email": "john@example.com",
      "avatarUrl": "https://example.com/avatar.jpg",
      "createdAt": "2024-03-15T10:00:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - 401: Unauthorized

### Update Profile
- **Method**: `PUT /auth/profile`
- **Headers**: 
  ```
  Authorization: Bearer <your_token>
  Content-Type: application/json
  ```
- **Request Body**:
  ```json
  {
    "fullName": "John Updated",
    "userName": "johnupdated",
    "email": "john.updated@example.com",
    "avatarUrl": "https://example.com/new-avatar.jpg"
  }
  ```
- **Response**: Same as Get Current User
- **Error Responses**:
  - 400: Invalid input data
  - 401: Unauthorized
  - 409: Username or email already exists

### Change Password
- **Method**: `PUT /auth/change-password`
- **Headers**: 
  ```
  Authorization: Bearer <your_token>
  Content-Type: application/json
  ```
- **Request Body**:
  ```json
  {
    "currentPassword": "oldpassword",
    "newPassword": "newpassword"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Password updated successfully"
  }
  ```
- **Error Responses**:
  - 400: Invalid current password
  - 401: Unauthorized

### Logout
- **Method**: `POST /auth/logout`
- **Headers**: 
  ```
  Authorization: Bearer <your_token>
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Logged out successfully"
  }
  ```
- **Error Responses**:
  - 401: Unauthorized

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

### Get Recent Decks
- **Method**: `GET /decks/recent`
- **Headers**: 
  ```
  Authorization: Bearer <your_token>
  ```
- **Query Parameters**:
  - `limit` (optional): Number of recent decks to return (default: 5)
- **Response**: Same as Get All Decks
- **Error Responses**:
  - 401: Unauthorized
  - 500: Server error

### Search Decks
- **Method**: `GET /decks/search`
- **Headers**: 
  ```
  Authorization: Bearer <your_token>
  ```
- **Query Parameters**:
  - `query` (required): Search term to match against deck titles and descriptions
- **Response**: Same as Get All Decks
- **Error Responses**:
  - 400: Missing search query
  - 401: Unauthorized
  - 500: Server error

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

## Cards

### Get All Cards in a Deck
- **Method**: `GET /decks/:deckId/cards`
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
        "id": "card-uuid",
        "question": "What is hello in Spanish?",
        "answer": "Hola"
      }
    ]
  }
  ```
- **Error Responses**:
  - 404: Deck not found
  - 401: Unauthorized
  - 500: Server error

### Get Single Card
- **Method**: `GET /decks/:deckId/cards/:cardId`
- **Headers**: 
  ```
  Authorization: Bearer <your_token>
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "card-uuid",
      "question": "What is hello in Spanish?",
      "answer": "Hola"
    }
  }
  ```
- **Error Responses**:
  - 404: Card not found
  - 401: Unauthorized
  - 500: Server error

### Create Card
- **Method**: `POST /decks/:deckId/cards`
- **Headers**: 
  ```
  Authorization: Bearer <your_token>
  Content-Type: application/json
  ```
- **Request Body**:
  ```json
  {
    "question": "What is good morning in Spanish?",
    "answer": "Buenos días"
  }
  ```
- **Response**: Same as Get Single Card
- **Error Responses**:
  - 404: Deck not found
  - 403: Not authorized to add cards to this deck
  - 400: Invalid input data
  - 401: Unauthorized
  - 500: Server error

### Update Card
- **Method**: `PUT /decks/:deckId/cards/:cardId`
- **Headers**: 
  ```
  Authorization: Bearer <your_token>
  Content-Type: application/json
  ```
- **Request Body**:
  ```json
  {
    "question": "Updated question",
    "answer": "Updated answer"
  }
  ```
- **Response**: Same as Get Single Card
- **Error Responses**:
  - 404: Card not found
  - 403: Not authorized to update this card
  - 400: Invalid input data
  - 401: Unauthorized
  - 500: Server error

### Delete Card
- **Method**: `DELETE /decks/:deckId/cards/:cardId`
- **Headers**: 
  ```
  Authorization: Bearer <your_token>
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Card deleted successfully"
  }
  ```
- **Error Responses**:
  - 404: Card not found
  - 403: Not authorized to delete this card
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

## Deck Ratings

### Get All Ratings for a Deck
- **Method**: `GET /decks/:deckId/ratings`
- **Headers**: 
  ```
  Authorization: Bearer <your_token>
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "ratings": [
        {
          "id": "rating-uuid",
          "userId": "user-uuid",
          "isLike": true,
          "user": {
            "id": "user-uuid",
            "userName": "johndoe",
            "fullName": "John Doe"
          }
        }
      ],
      "summary": {
        "totalRatings": 10,
        "likes": 8,
        "dislikes": 2
      }
    }
  }
  ```
- **Error Responses**:
  - 404: Deck not found
  - 401: Unauthorized
  - 500: Server error

### Rate a Deck
- **Method**: `POST /decks/:deckId/ratings`
- **Headers**: 
  ```
  Authorization: Bearer <your_token>
  Content-Type: application/json
  ```
- **Request Body**:
  ```json
  {
    "isLike": true  // true for like, false for dislike
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "id": "rating-uuid",
      "userId": "user-uuid",
      "isLike": true
    }
  }
  ```
- **Error Responses**:
  - 404: Deck not found
  - 400: Invalid input data
  - 401: Unauthorized
  - 500: Server error

### Delete User's Rating
- **Method**: `DELETE /decks/:deckId/ratings`
- **Headers**: 
  ```
  Authorization: Bearer <your_token>
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Rating deleted successfully"
  }
  ```
- **Error Responses**:
  - 404: Rating not found
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

6. **Updating Progress with Multiple Attempts**:
   You can update your progress multiple times for the same deck. For example, if you got 5 out of 10 cards correct in your first attempt, and then 8 out of 10 in your second attempt:

   a. **First Attempt** (5 out of 10 correct):
   ```javascript
   // For each card, make a request to update progress
   fetch('/api/v1/decks/123/cards/456/progress', {
     method: 'POST',
     headers: {
       'Authorization': 'Bearer your-token',
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       "isCorrect": true  // for correct answers
     })
   });
   // Response for a correct answer:
   {
     "status": "success",
     "data": {
       "id": "progress-uuid",
       "userId": "user-uuid",
       "cardId": "card-uuid",
       "status": "know",
       "nextReview": "2024-03-22T10:00:00.000Z", // 7 days later
       "reviewCount": 1,
       "card": {
         "id": "card-uuid",
         "question": "What is hello in Spanish?",
         "answer": "Hola"
       }
     }
   }
   ```

   b. **Second Attempt** (8 out of 10 correct):
   ```javascript
   // Make the same requests again for each card
   fetch('/api/v1/decks/123/cards/456/progress', {
     method: 'POST',
     headers: {
       'Authorization': 'Bearer your-token',
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       "isCorrect": false  // for incorrect answers
     })
   });
   // Response for an incorrect answer:
   {
     "status": "success",
     "data": {
       "id": "progress-uuid",
       "userId": "user-uuid",
       "cardId": "card-uuid",
       "status": "learning", // Changed to learning
       "nextReview": "2024-03-16T10:00:00.000Z", // 1 day later
       "reviewCount": 2, // Increased review count
       "card": {
         "id": "card-uuid",
         "question": "What is hello in Spanish?",
         "answer": "Hola"
       }
     }
   }
   ```

   c. **Check Overall Progress**:
   ```javascript
   // Get your current progress for the deck
   fetch('/api/v1/decks/123/progress', {
     method: 'GET',
     headers: {
       'Authorization': 'Bearer your-token'
     }
   });
   // Response:
   {
     "status": "success",
     "data": {
       "deckId": "deck-uuid",
       "totalCards": 10,
       "progress": [
         // ... all cards with their current status
       ],
       "summary": {
         "totalCards": 10,
         "knownCards": 8, // Cards you know
         "learningCards": 2, // Cards you're still learning
         "completionPercentage": 80
       }
     }
   }
   ```

   The system will:
   - Track each attempt separately
   - Update the status based on your latest answer
   - Keep track of how many times you've reviewed each card
   - Adjust the next review date based on whether you got it right or wrong
   - Provide a summary of your overall progress

7. **Best Practices**:
   - Update progress immediately after answering each card
   - Check your overall progress regularly to see your improvement
   - Focus on cards marked as "learning" in your next review session
   - Use the review schedule to space out your learning effectively

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