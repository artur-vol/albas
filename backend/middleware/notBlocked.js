import User from '../models/user.js';

export async function notBlocked(req, res, next) {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(401).json({ message: 'Користувача не знайдено' });
    }
    if (user.blocked) {
      return res.status(403).json({ message: 'Ваш обліковий запис заблоковано' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Помилка перевірки блокування', error: err.message });
  }
}

