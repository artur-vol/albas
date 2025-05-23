import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.js';

dotenv.config();

export async function registerUser(req, res) {
  try {
    const { full_name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'Користувач вже існує' });

    const password_hash = await bcrypt.hash(password, 10);

    await User.create({
      full_name,
      email,
      password_hash,
      phone,
      role: 'reader',
      blocked: false,
    });

    res.status(201).json({ message: 'Користувача зареєстровано' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Помилка реєстрації', error: err.message });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Невірна пошта або пароль' });

    if (user.blocked) {
      return res.status(403).json({
        message: 'Ваш обліковий запис заблоковано. Зверніться до адміністратора.',
      });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(400).json({ message: 'Невірна пошта або пароль' });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: 'Помилка входу', error: err.message });
  }
}

