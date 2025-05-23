import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swaggerConfig.js';
import YAML from 'yamljs';

import authRoutes from './routes/auth.js';
import bookRoutes from './routes/books.js';
import userRoutes from './routes/users.js';
import borrowingRoutes from './routes/borrowing.js';
import bookingRoutes from './routes/bookings.js';
import fineRoutes from './routes/fines.js';
import authorRoutes from './routes/authors.js';
import genreRoutes from './routes/genres.js';
import publisherRoutes from './routes/publishers.js';
import myBooksRoutes from './routes/myBooks.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/users', userRoutes);
app.use('/borrow', borrowingRoutes);
app.use('/bookings', bookingRoutes);
app.use('/fines', fineRoutes);
app.use('/authors', authorRoutes);
app.use('/genres', genreRoutes);
app.use('/publishers', publisherRoutes);
app.use('/my-books', myBooksRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const swaggerDocument = YAML.load('./swagger.yaml');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

