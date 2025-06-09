const express = require('express');
const router = express.Router();
const studySessionController = require('../controllers/studysession.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Все маршруты требуют аутентификации
router.use(authMiddleware);

// Начать новую сессию изучения
router.post('/start', studySessionController.startSession);

// Обновить статус карточки
router.post('/update-card', studySessionController.updateCardStatus);

// Завершить сессию
router.post('/end/:sessionId', studySessionController.endSession);

// Получить текущую сессию
router.get('/current/:userId/:deckId', studySessionController.getCurrentSession);

module.exports = router; 