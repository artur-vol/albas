import Fine from '../models/fine.js';

export async function getAllFines(req, res) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ заборонено' });
  }

  try {
    const fines = await Fine.find()
      .populate('user_id', 'full_name email')
      .sort({ createdAt: -1 });
    res.json(fines);
  } catch (err) {
    res.status(500).json({ message: 'Помилка отримання всіх штрафів', error: err.message });
  }
}

export async function getUserFines(req, res) {
  const requester = req.user;
  const { userId } = req.params;

  if (requester.userId !== userId && requester.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ заборонено' });
  }

  try {
    const fines = await Fine.find({ user_id: userId });
    res.json(fines);
  } catch (err) {
    res.status(500).json({ message: 'Помилка отримання штрафів', error: err.message });
  }
}

export async function markFinePaid(req, res) {
  const { fineId } = req.params;
  const requester = req.user;

  try {
    const fine = await Fine.findById(fineId);
    if (!fine) {
      return res.status(404).json({ message: 'Штраф не знайдено' });
    }

    if (requester.userId !== fine.user_id.toString() && requester.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ заборонено' });
    }

    fine.paid = true;
    await fine.save();

    res.json({ message: 'Штраф позначено як сплачений', fine });
  } catch (err) {
    res.status(500).json({ message: 'Помилка оновлення штрафу', error: err.message });
  }
}
