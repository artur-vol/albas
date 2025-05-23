import Author from '../models/author.js';

export async function getAllAuthors(req, res) {
  const authors = await Author.find();
  res.json(authors);
}

export async function getAuthorById(req, res) {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) return res.status(404).json({ message: 'Автора не знайдено' });
    res.json(author);
  } catch (err) {
    res.status(400).json({ message: 'Некоректний ID автора' });
  }
}

export async function createAuthor(req, res) {
  try {
    const { name, birth_year, death_year, biography } = req.body;
    const author = await Author.create({ name, birth_year, death_year, biography });
    res.status(201).json(author);
  } catch (err) {
    res.status(400).json({ message: 'Помилка при створенні автора', error: err.message });
  }
}

export async function updateAuthor(req, res) {
  try {
    const updated = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: 'Автора не знайдено' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Помилка при оновленні автора', error: err.message });
  }
}

export async function deleteAuthor(req, res) {
  try {
    const deleted = await Author.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Автора не знайдено' });
    res.json({ message: 'Автора видалено' });
  } catch (err) {
    res.status(400).json({ message: 'Помилка при видаленні автора', error: err.message });
  }
}

