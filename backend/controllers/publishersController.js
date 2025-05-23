import Publisher from '../models/publisher.js';

export async function getAllPublishers(req, res) {
  const publishers = await Publisher.find();
  res.json(publishers);
}

export async function getPublisherById(req, res) {
  try {
    const publisher = await Publisher.findById(req.params.id);
    if (!publisher) return res.status(404).json({ message: 'Видавництво не знайдено' });
    res.json(publisher);
  } catch (err) {
    res.status(400).json({ message: 'Некоректний ID видавництва' });
  }
}

export async function createPublisher(req, res) {
  try {
    const { name, city, founded_year } = req.body;
    const publisher = await Publisher.create({ name, city, founded_year });
    res.status(201).json(publisher);
  } catch (err) {
    res.status(400).json({ message: 'Помилка при створенні видавництва', error: err.message });
  }
}

export async function updatePublisher(req, res) {
  try {
    const updated = await Publisher.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ message: 'Видавництво не знайдено' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Помилка при оновленні видавництва', error: err.message });
  }
}

export async function deletePublisher(req, res) {
  try {
    const deleted = await Publisher.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Видавництво не знайдено' });
    res.json({ message: 'Видавництво видалено' });
  } catch (err) {
    res.status(400).json({ message: 'Помилка при видаленні видавництва', error: err.message });
  }
}

