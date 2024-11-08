import mongoose from 'mongoose';

// Reading Progress Schema
const readingProgressSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book', // Reference to the Book model
    required: true,
  },
  // Progress as a percentage (0 to 100)
  progress: {
    type: Number,
    required: true,
    min: 0, // Minimum value
    max: 100, // Maximum value
  },
  created_at: {
    type: Date,
    default: Date.now, // Set default to current date and time
  },
  updated_at: {
    type: Date,
  },
});

// Update `updated_at` field before saving
readingProgressSchema.pre('save', function (next) {
  this.updated_at = Date.now(); // Set updated_at to current date and time
  next();
});

// Reading Progress model
const ReadingProgress = mongoose.model('ReadingProgress', readingProgressSchema);

export default ReadingProgress;
