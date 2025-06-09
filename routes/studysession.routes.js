const express = require("express");
const router = express.Router();
const studySessionController = require("../controllers/studysession.controller");
const { verifyToken } = require("../middleware/authMiddleware");

// Все маршруты требуют аутентификации
router.use(verifyToken);

// Начать новую сессию изучения
router.post("/start", studySessionController.startSession);

// Обновить статус карточки
router.post("/update-card", studySessionController.updateCardStatus);

// Завершить сессию
router.post("/end/:sessionId", studySessionController.endSession);

// Получить текущую сессию
router.get("/current/:deckId", studySessionController.getCurrentSession);

module.exports = router;
