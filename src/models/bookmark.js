import mongoose from 'mongoose';

// Bookmark Schema
const bookmarkSchema = new mongoose.Schema({
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
  // Page number where the bookmark is placed
  page_number: {
    type: Number,
    required: true,
    min: 1, // Minimum page value
  },
  // Optional note or description for the bookmark
  note: {
    type: String,
    trim: true, // Remove extra spaces
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
bookmarkSchema.pre('save', function (next) {
  this.updated_at = Date.now(); // Set updated_at to current date and time
  next();
});

// Bookmark model
const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

export default Bookmark;
