# Flash Card API Documentation

## System Overview

### Core Concepts

1. **Users**
   - Users can register and authenticate using email/password
   - Each user has a profile with personal information
   - Users can create decks and study cards
   - Users can rate decks and track their progress

2. **Decks (Колоды)**
   - A collection of related flashcards
   - Can be public or private
   - Contains metadata like title, description, and language settings
   - Tracks study progress and statistics
   - Can be rated by users

3. **Cards (Карточки)**
   - Individual flashcards within a deck
   - Contains question and answer
   - Tracks user's answer history
   - Used in study sessions

4. **Study Sessions**
   - Represents a single study period
   - Tracks progress through deck cards
   - Records correct/incorrect answers
   - Calculates session statistics
   - Updates overall deck progress

5. **User Progress**
   - Tracks overall progress for each deck
   - Records mastered cards
   - Calculates completion percentage
   - Maintains study history

### System Workflows

#### 1. User Registration and Authentication
1. User registers with email, password, and personal info
2. System creates user account and generates tokens
3. User logs in to get access token
4. Access token is used for all authenticated requests
5. Refresh token is used to get new access tokens
6. User can update profile and change password

#### 2. Deck Management
1. User creates a new deck with title and description
2. System creates deck and associates it with user
3. User can add cards to the deck
4. User can make deck public or private
5. Other users can view and study public decks
6. User can update or delete their decks

#### 3. Card Management
1. User adds cards to their deck
2. Each card has a question and answer
3. Cards can be updated or deleted
4. System tracks user's answers for each card
5. Progress is calculated based on correct answers

#### 4. Study Session Flow
1. User starts a new study session for a deck
2. System creates session and loads deck cards
3. For each card:
   - User sees the question
   - User provides an answer
   - System checks if answer is correct
   - Progress is updated
4. Session ends when all cards are answered
5. System calculates session statistics
6. Overall deck progress is updated

#### 5. Progress Tracking
1. System tracks:
   - Total cards in deck
   - Cards mastered by user
   - Completion percentage
   - Study time
   - Number of sessions
   - Average accuracy
2. Progress is updated after each session
3. User can view their progress statistics
4. System provides time-based statistics (day/week/month)

#### 6. Rating System
1. Users can rate decks (like/dislike)
2. System tracks:
   - Total ratings
   - Number of likes/dislikes
   - Individual user ratings
3. Users can update or remove their ratings
4. Ratings are visible to all users

### Data Relationships

```
User
 ├── Decks (created by user)
 │    ├── Cards (in deck)
 │    │    └── UserCardAnswers (user's answers)
 │    ├── DeckProgress (user's progress)
 │    └── DeckRatings (user's ratings)
 └── StudySessions (user's sessions)
      └── UserCardAnswers (answers in session)
```

### Security Features

1. **Authentication**
   - JWT-based authentication
   - Access and refresh tokens
   - Token expiration and refresh
   - Secure password storage

2. **Authorization**
   - User can only modify their own resources
   - Public/private deck access control
   - Rate limiting on endpoints
   - Input validation

3. **Data Protection**
   - Password hashing
   - Secure token storage
   - Input sanitization
   - Error handling

### Best Practices for Implementation

1. **Error Handling**
   - Use appropriate HTTP status codes
   - Provide clear error messages
   - Log errors for debugging
   - Handle edge cases

2. **Performance**
   - Implement pagination for large datasets
   - Use efficient database queries
   - Cache frequently accessed data
   - Optimize response payloads

3. **User Experience**
   - Provide clear feedback
   - Handle loading states
   - Implement proper validation
   - Maintain session state

4. **Development**
   - Follow RESTful conventions
   - Use consistent naming
   - Document all endpoints
   - Write unit tests

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
- **Method**: `GET /users/:userId`
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

Study sessions are the core functionality of the flashcard system. They allow users to study cards from a deck in a structured way, track their progress, and improve their learning.

### Start Session
- **Method**: `POST /study-sessions/start`
- **Headers**: Requires JWT token
- **Description**: 
  Initiates a new study session for a specific deck. The system will:
  1. Create a new study session record
  2. Initialize session statistics (correct/incorrect answers, progress)
  3. Create or update deck progress tracking
  4. Return session details and current deck progress

- **Body**:
  ```json
  {
    "deckId": "deck-uuid"  // Required: ID of the deck to study
  }
  ```
- **Response** (201):
  ```json
  {
    "session": {
      "id": "session-uuid",        // Unique session identifier
      "userId": "user-uuid",       // ID of the user studying
      "deckId": "deck-uuid",       // ID of the deck being studied
      "totalCards": 10,            // Total number of cards in the deck
      "correctAnswers": 0,         // Number of correct answers so far
      "incorrectAnswers": 0,       // Number of incorrect answers so far
      "currentCardIndex": 0,       // Current position in the deck
      "sessionProgress": 0,        // Overall progress percentage
      "startTime": "2024-03-15T10:00:00.000Z",  // When the session started
      "isCompleted": false         // Session completion status
    },
    "deckProgress": {
      "id": "progress-uuid",           // Progress tracking ID
      "userId": "user-uuid",           // User ID
      "deckId": "deck-uuid",           // Deck ID
      "totalCards": 10,                // Total cards in deck
      "masteredCards": 0,              // Cards mastered by user
      "completionPercentage": 0,       // Overall deck completion
      "totalStudyTime": 0,             // Total time spent studying
      "totalSessions": 1,              // Number of study sessions
      "averageAccuracy": 0,            // Average correct answers
      "lastStudiedAt": "2024-03-15T10:00:00.000Z"  // Last study time
    }
  }
  ```
- **Errors**:
  - 400: Invalid input data (e.g., missing deckId)
  - 401: Unauthorized (invalid or missing token)
  - 404: Deck not found
  - 500: Server error

### Update Card Status
- **Method**: `POST /study-sessions/update-card`
- **Headers**: Requires JWT token
- **Description**:
  Updates the status of a card in the current study session. This endpoint:
  1. Records the user's answer for the card
  2. Updates session statistics
  3. Updates deck progress
  4. Returns updated session and progress information

- **Body**:
  ```json
  {
    "sessionId": "session-uuid",  // Required: Current session ID
    "cardId": "card-uuid",        // Required: ID of the card being answered
    "isCorrect": true             // Required: Whether the answer was correct
  }
  ```
- **Response** (200):
  ```json
  {
    "session": {
      "id": "session-uuid",
      "correctAnswers": 1,        // Updated count of correct answers
      "incorrectAnswers": 0,      // Updated count of incorrect answers
      "currentCardIndex": 1,      // Updated position in deck
      "sessionProgress": 10       // Updated progress percentage
    },
    "deckProgress": {
      "id": "progress-uuid",
      "masteredCards": 1,         // Updated count of mastered cards
      "completionPercentage": 10, // Updated completion percentage
      "lastStudiedAt": "2024-03-15T10:00:00.000Z"  // Updated study time
    }
  }
  ```
- **Errors**:
  - 400: Invalid input data (e.g., missing required fields)
  - 401: Unauthorized
  - 404: Session not found
  - 500: Server error

### End Session
- **Method**: `POST /study-sessions/end/:sessionId`
- **Headers**: Requires JWT token
- **Description**:
  Finalizes a study session and calculates final statistics. This endpoint:
  1. Marks the session as completed
  2. Calculates final session statistics
  3. Updates overall deck progress
  4. Returns comprehensive session results

- **Response** (200):
  ```json
  {
    "sessionStats": {
      "totalCards": 10,           // Total cards in the deck
      "correctAnswers": 8,        // Final correct answers count
      "incorrectAnswers": 2,      // Final incorrect answers count
      "accuracy": 80,             // Final accuracy percentage
      "studyTime": 15,            // Total study time in minutes
      "deckProgress": {
        "id": "progress-uuid",
        "totalStudyTime": 15,     // Updated total study time
        "totalSessions": 1,       // Updated session count
        "averageAccuracy": 80     // Updated average accuracy
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
- **Description**:
  Retrieves the active study session for a specific deck. This endpoint:
  1. Checks for an active session
  2. Returns session details including:
     - Current progress
     - Answered cards
     - Session statistics
     - Card details

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
      "UserCardAnswers": [        // Array of answered cards
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

### Study Session Flow Example

Here's a typical flow of a study session:

1. **Start Session**
   ```http
   POST /study-sessions/start
   {
     "deckId": "deck-uuid"
   }
   ```
   - System creates new session
   - Returns session ID and initial progress

2. **Study Cards**
   ```http
   POST /study-sessions/update-card
   {
     "sessionId": "session-uuid",
     "cardId": "card-uuid",
     "isCorrect": true
   }
   ```
   - Repeat for each card
   - System updates progress after each answer

3. **End Session**
   ```http
   POST /study-sessions/end/:sessionId
   ```
   - System calculates final statistics
   - Updates overall deck progress

4. **Check Progress**
   ```http
   GET /study-sessions/current/:deckId
   ```
   - View current session status
   - Review answered cards

### Best Practices for Study Sessions

1. **Session Management**
   - Start new session only when previous one is completed
   - Handle session timeouts appropriately
   - Implement session recovery for interrupted sessions

2. **Progress Tracking**
   - Update progress after each card
   - Calculate statistics in real-time
   - Maintain accurate study time

3. **Error Handling**
   - Handle network interruptions
   - Validate all inputs
   - Provide clear error messages

4. **Performance**
   - Optimize database queries
   - Cache frequently accessed data
   - Implement proper indexing

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
