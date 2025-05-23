import Genre from '../models/genre.js';

export async function getAllGenres(req, res) {
  const genres = await Genre.find();
  res.json(genres);
}

export async function getGenreById(req, res) {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).json({ message: 'Жанр не знайдено' });
    res.json(genre);
  } catch (err) {
    res.status(400).json({ message: 'Некоректний ID жанру' });
  }
}

export async function createGenre(req, res) {
  try {
    const { name, description } = req.body;
    const genre = await Genre.create({ name, description });
    res.status(201).json(genre);
  } catch (err) {
    res.status(400).json({ message: 'Помилка при створенні жанру', error: err.message });
  }
}

export async function updateGenre(req, res) {
  try {
    const updated = await Genre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ message: 'Жанр не знайдено' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Помилка при оновленні жанру', error: err.message });
  }
}

export async function deleteGenre(req, res) {
  try {
    const deleted = await Genre.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Жанр не знайдено' });
    res.json({ message: 'Жанр видалено' });
  } catch (err) {
    res.status(400).json({ message: 'Помилка при видаленні жанру', error: err.message });
  }
}

