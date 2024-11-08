import mongoose from 'mongoose';

// Book Schema
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  publish_date: {
    type: Date,
    required: true,
  },
  publisher: {
    type: String,
    required: true,
    trim: true,
  },
  cover_image: {
    type: String,
    trim: true,
  },
  file_page: {
    type: String,
    trim: true,
  },
  file_format: {
    type: String,
    required: true,
    enum: ['epub', 'pdf', 'mobi'], // File format limited to 'epub', 'pdf', 'mobi'
  },
  genres: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Genre', // Reference to ID in genres collection
    },
  ],
  summary: {
    type: String,
    trim: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
  },
});

// Update `updated_at` before saving
bookSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

// Book model
const Book = mongoose.model('Book', bookSchema);

export default Book;
