db = db.getSiblingDB('library');


// ========== КОРИСТУВАЧІ ==========

const users = db.users.insertMany([
  {
    _id: ObjectId(),
    full_name: "John Smith",
    email: "john@example.com",
    password_hash: "$2b$10$9EKpOzWBnA3GszzD5fJ7peXhzF7QkxUJYFqyIsTmK0eHQF42dSHcK", // john1234
    role: "reader",
    phone: "+12025550111",
    blocked: false
  },
  {
    _id: ObjectId(),
    full_name: "Anna Müller",
    email: "anna.mueller@example.com",
    password_hash: "$2b$10$3aV0Z1BuwY61.UKmxiR7m.8Lq85iRbqZbQ23pGKKMODEpLLMCOsA6", // anna1234
    role: "reader",
    phone: "+4915123456789",
    blocked: false
  },
  {
    _id: ObjectId(),
    full_name: "Sophie Dubois",
    email: "sophie.dubois@example.com",
    password_hash: "$2b$10$O9I.v32d2a0PidXyOzeMdO33sdOn8jESdDZV/3wUBmFQ8Mod/taDi", // sophie1234
    role: "reader",
    phone: "+33782345678",
    blocked: false
  },
  {
    _id: ObjectId(),
    full_name: "Admin Librarian",
    email: "admin@example.com",
    password_hash: "$2b$10$Fez2FMNjwUB8njapbR06A.piOP3xDhra1S7NApbKlfd6awL28Jvka", // admin1234
    role: "admin",
    phone: "+380500000000",
    blocked: false
  }
]);


// ========== ЖАНРИ ==========

const genres = db.genres.insertMany([
  { _id: ObjectId(), name: "Science Fiction", description: "Speculative and futuristic stories." },
  { _id: ObjectId(), name: "Fantasy", description: "Magic, mythology, and imaginary worlds." },
  { _id: ObjectId(), name: "Classic Literature", description: "Works considered exemplary or noteworthy." },
  { _id: ObjectId(), name: "Historical Fiction", description: "Fictional stories set in a real historical period." },
  { _id: ObjectId(), name: "Non-Fiction", description: "Based on facts and real events." },
  { _id: ObjectId(), name: "Mystery", description: "Fiction dealing with the solution of a crime or unraveling secrets." },
  { _id: ObjectId(), name: "Biography", description: "Stories of real people's lives." }
]);


// ========== ВИДАВНИЦТВА ==========

const publishers = db.publishers.insertMany([
  { _id: ObjectId(), name: "Penguin Books", city: "London", founded_year: 1935 },
  { _id: ObjectId(), name: "HarperCollins", city: "New York", founded_year: 1989 },
  { _id: ObjectId(), name: "Simon & Schuster", city: "New York", founded_year: 1924 },
  { _id: ObjectId(), name: "Macmillan Publishers", city: "London", founded_year: 1843 },
  { _id: ObjectId(), name: "Random House", city: "New York", founded_year: 1927 }
]);


// ========== АВТОРИ ==========

const authors = db.authors.insertMany([
  { _id: ObjectId(), name: "George Orwell", birth_year: 1903, death_year: 1950, biography: "British writer and journalist, author of '1984' and 'Animal Farm'." },
  { _id: ObjectId(), name: "J.K. Rowling", birth_year: 1965, death_year: null, biography: "British author, best known for the Harry Potter series." },
  { _id: ObjectId(), name: "Isaac Asimov", birth_year: 1920, death_year: 1992, biography: "American writer and professor of biochemistry, famous for his works on science fiction and popular science." },
  { _id: ObjectId(), name: "Jane Austen", birth_year: 1775, death_year: 1817, biography: "English novelist known primarily for her six major novels, including 'Pride and Prejudice'." },
  { _id: ObjectId(), name: "Harper Lee", birth_year: 1926, death_year: 2016, biography: "American novelist best known for 'To Kill a Mockingbird'." },
  { _id: ObjectId(), name: "Yuval Noah Harari", birth_year: 1976, death_year: null, biography: "Israeli public intellectual, historian and author of 'Sapiens: A Brief History of Humankind'." },
  { _id: ObjectId(), name: "F. Scott Fitzgerald", birth_year: 1896, death_year: 1940, biography: "American novelist and short story writer, author of 'The Great Gatsby'." },
  { _id: ObjectId(), name: "Mary Shelley", birth_year: 1797, death_year: 1851, biography: "English novelist who wrote the Gothic novel 'Frankenstein'." }
]);


// ========== КНИГИ ==========

const books = db.books.insertMany([
  {
    _id: ObjectId(),
    title: "1984",
    isbn: "978-0-452-28423-4",
    author_id: authors.insertedIds[0],
    genre_id: genres.insertedIds[0],
    publisher_id: publishers.insertedIds[0],
    year: 1949,
    copies_total: 7,
    copies_available: 5,
    description: "A dystopian social science fiction novel and cautionary tale, warning of the dangers of totalitarianism."
  },
  {
    _id: ObjectId(),
    title: "Harry Potter and the Philosopher's Stone",
    isbn: "978-0-7475-3269-9",
    author_id: authors.insertedIds[1],
    genre_id: genres.insertedIds[1],
    publisher_id: publishers.insertedIds[1],
    year: 1997,
    copies_total: 10,
    copies_available: 6,
    description: "The first book in the Harry Potter series, introducing the young wizard Harry Potter."
  },
  {
    _id: ObjectId(),
    title: "Foundation",
    isbn: "978-0-553-80371-0",
    author_id: authors.insertedIds[2],
    genre_id: genres.insertedIds[0],
    publisher_id: publishers.insertedIds[2],
    year: 1951,
    copies_total: 8,
    copies_available: 3,
    description: "Science fiction novel about the collapse and rebirth of a galactic empire."
  },
  {
    _id: ObjectId(),
    title: "Pride and Prejudice",
    isbn: "978-0-19-280238-5",
    author_id: authors.insertedIds[3],
    genre_id: genres.insertedIds[2],
    publisher_id: publishers.insertedIds[1],
    year: 1813,
    copies_total: 4,
    copies_available: 2,
    description: "A romantic novel that charts the emotional development of the protagonist Elizabeth Bennet."
  },
  {
    _id: ObjectId(),
    title: "To Kill a Mockingbird",
    isbn: "978-0-06-112008-4",
    author_id: authors.insertedIds[4],
    genre_id: genres.insertedIds[2],
    publisher_id: publishers.insertedIds[0],
    year: 1960,
    copies_total: 5,
    copies_available: 1,
    description: "A novel about the serious issues of rape and racial inequality."
  },
  {
    _id: ObjectId(),
    title: "Sapiens: A Brief History of Humankind",
    isbn: "978-0-06-231609-7",
    author_id: authors.insertedIds[5],
    genre_id: genres.insertedIds[3],
    publisher_id: publishers.insertedIds[2],
    year: 2011,
    copies_total: 6,
    copies_available: 5,
    description: "Explores the history and impact of Homo sapiens."
  },
  {
    _id: ObjectId(),
    title: "The Great Gatsby",
    isbn: "978-0-7432-7356-5",
    author_id: authors.insertedIds[6],
    genre_id: genres.insertedIds[2],
    publisher_id: publishers.insertedIds[1],
    year: 1925,
    copies_total: 7,
    copies_available: 2,
    description: "A story about the Jazz Age in the United States."
  },
  {
    _id: ObjectId(),
    title: "Frankenstein",
    isbn: "978-0-14-143947-1",
    author_id: authors.insertedIds[7],
    genre_id: genres.insertedIds[0],
    publisher_id: publishers.insertedIds[0],
    year: 1818,
    copies_total: 3,
    copies_available: 1,
    description: "A novel about Victor Frankenstein, a young scientist who creates a sapient creature."
  }
]);


// ========== ВИДАЧА КНИГ ==========

db.bookborrowings.insertMany([
  // George Orwell — 1984
  {
    _id: ObjectId(),
    user_id: users.insertedIds[0], // John Smith
    book_id: books.insertedIds[0],
    borrow_date: new Date("2025-05-10"),
    due_date: new Date("2025-05-24"),
    return_date: null,
    fine: 0
  },
  // Jane Austen — Pride and Prejudice (попередня видача)
  {
    _id: ObjectId(),
    user_id: users.insertedIds[1], // Emily Johnson
    book_id: books.insertedIds[3],
    borrow_date: new Date("2025-04-15"),
    due_date: new Date("2025-04-29"),
    return_date: new Date("2025-04-30"),
    fine: 0
  },
  // Yuval Noah Harari — Sapiens
  {
    _id: ObjectId(),
    user_id: users.insertedIds[0], // John Smith
    book_id: books.insertedIds[5],
    borrow_date: new Date("2025-05-01"),
    due_date: new Date("2025-05-15"),
    return_date: new Date("2025-05-16"),
    fine: 10
  },
  // Isaac Asimov — Foundation (активна видача)
  {
    _id: ObjectId(),
    user_id: users.insertedIds[2], // Admin
    book_id: books.insertedIds[2],
    borrow_date: new Date("2025-05-05"),
    due_date: new Date("2025-05-19"),
    return_date: null,
    fine: 0
  },
  // F. Scott Fitzgerald — The Great Gatsby (активна видача)
  {
    _id: ObjectId(),
    user_id: users.insertedIds[1], // Emily Johnson
    book_id: books.insertedIds[6],
    borrow_date: new Date("2025-05-07"),
    due_date: new Date("2025-05-21"),
    return_date: null,
    fine: 0
  }
]);


// ========== БРОНЮВАННЯ ==========

db.bookbookings.insertMany([
  // Джон Сміт забронював "1984"
  {
    _id: ObjectId(),
    user_id: users.insertedIds[0], // John Smith
    book_id: books.insertedIds[0],
    booking_date: new Date("2025-05-18"),
    expires_at: new Date("2025-05-21"),
    active: true
  },
  // Емілі Джонсон — активне бронювання "Sapiens"
  {
    _id: ObjectId(),
    user_id: users.insertedIds[1], // Emily Johnson
    book_id: books.insertedIds[5],
    booking_date: new Date("2025-05-16"),
    expires_at: new Date("2025-05-19"),
    active: true
  },
  // Admin — завершене бронювання "Foundation"
  {
    _id: ObjectId(),
    user_id: users.insertedIds[2], // Admin
    book_id: books.insertedIds[2],
    booking_date: new Date("2025-04-25"),
    expires_at: new Date("2025-04-28"),
    active: false
  },
  // John Smith — завершене бронювання "The Great Gatsby"
  {
    _id: ObjectId(),
    user_id: users.insertedIds[0], // John Smith
    book_id: books.insertedIds[6],
    booking_date: new Date("2025-03-14"),
    expires_at: new Date("2025-03-17"),
    active: false
  }
]);


// ========== ШТРАФИ ==========

db.fines.insertMany([
  // John Smith — штраф за прострочення "1984"
  {
    _id: users.insertedIds[0],
    user_id: users.insertedIds[0],
    amount: 40,
    reason: "Late return of '1984'",
    paid: false
  },
  // Emily Johnson — штраф за прострочення "Sapiens"
  {
    _id: ObjectId(),
    user_id: users.insertedIds[1],
    amount: 20,
    reason: "Late return of 'Sapiens: A Brief History of Humankind'",
    paid: true
  },
  // Admin — штраф за прострочення "Foundation"
  {
    _id: ObjectId(),
    user_id: users.insertedIds[2],
    amount: 60,
    reason: "Late return of 'Foundation'",
    paid: false
  }
]);

