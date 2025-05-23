import User from '../models/user.js';

export const getAllUsers = async (req, res) => {
  const users = await User.find({}, { password_hash: 0 });
  res.json(users);
};

export const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.userId, { password_hash: 0 });
  if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });
  res.json(user);
};

export const getUserById = async (req, res) => {
  if (req.user.userId !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ заборонено' });
  }

  const user = await User.findById(req.params.id, { password_hash: 0 });
  if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });
  res.json(user);
};

export const updateUser = async (req, res) => {
  const isSelf = req.user.userId === req.params.id;
  const isAdmin = req.user.role === 'admin';

  if (!isSelf && !isAdmin) {
    return res.status(403).json({ message: 'Можна редагувати лише свій профіль або бути адміністратором' });
  }

  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      fields: { password_hash: 0 }
    });

    if (!updated) return res.status(404).json({ message: 'Користувача не знайдено' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Помилка при оновленні профілю', error: err.message });
  }
};

export const blockUser = async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.params.id, { blocked: true }, { new: true });
  if (!updated) return res.status(404).json({ message: 'Користувача не знайдено' });
  res.json({ message: 'Користувача заблоковано', user: updated });
};

export const unblockUser = async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.params.id, { blocked: false }, { new: true });
  if (!updated) return res.status(404).json({ message: 'Користувача не знайдено' });
  res.json({ message: 'Користувача розблоковано', user: updated });
};

export const deleteUser = async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) return res.status(404).json({ message: 'Користувача не знайдено' });

    if (userToDelete.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Неможливо видалити останнього адміністратора' });
      }
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Користувача видалено' });
  } catch (err) {
    res.status(500).json({ message: 'Помилка видалення', error: err.message });
  }
};

export const changeUserRole = async (req, res) => {
  const { role } = req.body;
  const allowedRoles = ['reader', 'moderator', 'admin'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Некоректна роль' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });

    if (user.role === 'admin' && role !== 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ message: 'Неможливо позбавити ролі останнього адміністратора' });
      }
    }

    user.role = role;
    await user.save();
    res.json({ message: 'Роль оновлено', user });
  } catch (err) {
    res.status(500).json({ message: 'Помилка зміни ролі', error: err.message });
  }
};

