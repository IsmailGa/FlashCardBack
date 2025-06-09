const { StudySession, DeckProgress, UserCardAnswer, Card, Deck } = require('../models');
const { Op } = require('sequelize');

class StudySessionController {
  // Начать новую сессию изучения
  async startSession(req, res) {
    try {
      const { userId, deckId } = req.body;

      // Проверяем существующую активную сессию
      const existingSession = await StudySession.findOne({
        where: {
          userId,
          deckId,
          isCompleted: false,
        },
      });

      if (existingSession) {
        return res.json({
          session: existingSession,
          message: 'Продолжаем существующую сессию',
        });
      }

      // Получаем информацию о колоде
      const deck = await Deck.findByPk(deckId, {
        include: [{ model: Card }],
      });

      if (!deck) {
        return res.status(404).json({ message: 'Колода не найдена' });
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

      return res.json({
        session,
        deckProgress,
        message: 'Новая сессия изучения начата',
      });
    } catch (error) {
      console.error('Error starting session:', error);
      return res.status(500).json({ message: 'Ошибка при создании сессии' });
    }
  }

  // Обновить статус карточки
  async updateCardStatus(req, res) {
    try {
      const { sessionId, cardId, isCorrect } = req.body;

      const session = await StudySession.findByPk(sessionId);
      if (!session) {
        return res.status(404).json({ message: 'Сессия не найдена' });
      }

      // Записываем ответ пользователя
      await UserCardAnswer.create({
        studySessionId: sessionId,
        cardId,
        isCorrect,
        userId: session.userId,
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
          userId: session.userId,
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

      return res.json({
        session,
        deckProgress,
        message: 'Статус карточки обновлен',
      });
    } catch (error) {
      console.error('Error updating card status:', error);
      return res.status(500).json({ message: 'Ошибка при обновлении статуса карточки' });
    }
  }

  // Завершить сессию
  async endSession(req, res) {
    try {
      const { sessionId } = req.params;

      const session = await StudySession.findByPk(sessionId);
      if (!session) {
        return res.status(404).json({ message: 'Сессия не найдена' });
      }

      // Обновляем статистику сессии
      session.endTime = new Date();
      session.isCompleted = true;
      await session.save();

      // Обновляем прогресс колоды
      const deckProgress = await DeckProgress.findOne({
        where: {
          userId: session.userId,
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
        deckProgress: deckProgress,
      };

      return res.json({
        sessionStats,
        message: 'Сессия успешно завершена',
      });
    } catch (error) {
      console.error('Error ending session:', error);
      return res.status(500).json({ message: 'Ошибка при завершении сессии' });
    }
  }

  // Получить текущую сессию
  async getCurrentSession(req, res) {
    try {
      const { userId, deckId } = req.params;

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
        return res.status(404).json({ message: 'Активная сессия не найдена' });
      }

      return res.json({ session });
    } catch (error) {
      console.error('Error getting current session:', error);
      return res.status(500).json({ message: 'Ошибка при получении текущей сессии' });
    }
  }
}

module.exports = new StudySessionController(); 