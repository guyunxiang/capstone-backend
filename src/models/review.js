import mongoose from 'mongoose';

// Review Schema
const reviewSchema = new mongoose.Schema({
  // Rating given by the user, should be a number between 1 and 5
  rating: {
    type: Number,
    required: true,
    min: 1, // Minimum rating value
    max: 5, // Maximum rating value
  },
  // Comment provided by the user about the book
  comment: {
    type: String,
    trim: true, // Remove whitespace from both ends
  },
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book', // Reference to the Book model
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now, // Set default to current date and time
  },
  updated_at: {
    type: Date,
  },
});

// Review model
const Review = mongoose.model('Review', reviewSchema);

export default Review;
