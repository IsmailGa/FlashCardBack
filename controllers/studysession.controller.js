const { StudySession, DeckProgress, UserCardAnswer, Card, Deck } = require('../models');
const { Op } = require('sequelize');

// Начать новую сессию изучения
const startSession = async (req, res) => {
  try {
    const { deckId } = req.body;
    const userId = req.user.id;

    // Проверяем существующую активную сессию
    const existingSession = await StudySession.findOne({
      where: {
        userId,
        deckId,
        isCompleted: false,
      },
    });

    if (existingSession) {
      return res.status(200).json({
        status: "success",
        data: {
          session: existingSession,
          message: 'Продолжаем существующую сессию',
        }
      });
    }

    // Получаем информацию о колоде
    const deck = await Deck.findByPk(deckId, {
      include: [{ model: Card }],
    });

    if (!deck) {
      return res.status(404).json({
        status: "error",
        message: 'Колода не найдена'
      });
    }

    // Создаем новую сессию
    const session = await StudySession.create({
      userId,
      deckId,
      totalCards: deck.Cards.length,
      startTime: new Date(),
    });

    // Создаем или обновляем прогресс колоды
    const [deckProgress] = await DeckProgress.findOrCreate({
      where: { userId, deckId },
      defaults: {
        totalCards: deck.Cards.length,
        lastStudiedAt: new Date(),
      },
    });

    return res.status(201).json({
      status: "success",
      data: {
        session,
        deckProgress,
        message: 'Новая сессия изучения начата',
      }
    });
  } catch (error) {
    console.error('Error starting session:', error);
    return res.status(500).json({
      status: "error",
      message: 'Ошибка при создании сессии',
      error: error.message
    });
  }
};

// Обновить статус карточки
const updateCardStatus = async (req, res) => {
  try {
    const { sessionId, cardId, isCorrect } = req.body;
    const userId = req.user.id;

    const session = await StudySession.findOne({
      where: { 
        id: sessionId,
        userId,
        isCompleted: false
      }
    });

    if (!session) {
      return res.status(404).json({
        status: "error",
        message: 'Сессия не найдена'
      });
    }

    // Записываем ответ пользователя
    await UserCardAnswer.create({
      studySessionId: sessionId,
      cardId,
      isCorrect,
      userId,
    });

    // Обновляем статистику сессии
    if (isCorrect) {
      session.correctAnswers += 1;
    } else {
      session.incorrectAnswers += 1;
    }
    session.currentCardIndex += 1;
    session.sessionProgress = (session.correctAnswers / session.totalCards) * 100;
    await session.save();

    // Обновляем прогресс колоды
    const deckProgress = await DeckProgress.findOne({
      where: {
        userId,
        deckId: session.deckId,
      },
    });

    if (deckProgress) {
      if (isCorrect) {
        deckProgress.masteredCards += 1;
      }
      deckProgress.completionPercentage = (deckProgress.masteredCards / deckProgress.totalCards) * 100;
      deckProgress.lastStudiedAt = new Date();
      await deckProgress.save();
    }

    return res.status(200).json({
      status: "success",
      data: {
        session,
        deckProgress,
        message: 'Статус карточки обновлен',
      }
    });
  } catch (error) {
    console.error('Error updating card status:', error);
    return res.status(500).json({
      status: "error",
      message: 'Ошибка при обновлении статуса карточки',
      error: error.message
    });
  }
};

// Завершить сессию
const endSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    const session = await StudySession.findOne({
      where: { 
        id: sessionId,
        userId,
        isCompleted: false
      }
    });

    if (!session) {
      return res.status(404).json({
        status: "error",
        message: 'Сессия не найдена'
      });
    }

    // Обновляем статистику сессии
    session.endTime = new Date();
    session.isCompleted = true;
    await session.save();

    // Обновляем прогресс колоды
    const deckProgress = await DeckProgress.findOne({
      where: {
        userId,
        deckId: session.deckId,
      },
    });

    if (deckProgress) {
      const studyTime = Math.round((session.endTime - session.startTime) / 1000 / 60); // в минутах
      deckProgress.totalStudyTime += studyTime;
      deckProgress.totalSessions += 1;
      deckProgress.averageAccuracy = 
        (deckProgress.averageAccuracy * (deckProgress.totalSessions - 1) + 
         (session.correctAnswers / session.totalCards) * 100) / 
        deckProgress.totalSessions;
      await deckProgress.save();
    }

    // Формируем статистику сессии
    const sessionStats = {
      totalCards: session.totalCards,
      correctAnswers: session.correctAnswers,
      incorrectAnswers: session.incorrectAnswers,
      accuracy: (session.correctAnswers / session.totalCards) * 100,
      studyTime: Math.round((session.endTime - session.startTime) / 1000 / 60),
      deckProgress,
    };

    return res.status(200).json({
      status: "success",
      data: {
        sessionStats,
        message: 'Сессия успешно завершена',
      }
    });
  } catch (error) {
    console.error('Error ending session:', error);
    return res.status(500).json({
      status: "error",
      message: 'Ошибка при завершении сессии',
      error: error.message
    });
  }
};

// Получить текущую сессию
const getCurrentSession = async (req, res) => {
  try {
    const { deckId } = req.params;
    const userId = req.user.id;

    const session = await StudySession.findOne({
      where: {
        userId,
        deckId,
        isCompleted: false,
      },
      include: [
        {
          model: UserCardAnswer,
          include: [{ model: Card }],
        },
      ],
    });

    if (!session) {
      return res.status(404).json({
        status: "error",
        message: 'Активная сессия не найдена'
      });
    }

    return res.status(200).json({
      status: "success",
      data: { session }
    });
  } catch (error) {
    console.error('Error getting current session:', error);
    return res.status(500).json({
      status: "error",
      message: 'Ошибка при получении текущей сессии',
      error: error.message
    });
  }
};

module.exports = {
  startSession,
  updateCardStatus,
  endSession,
  getCurrentSession
}; 