import mongoose from 'mongoose';

// Genre Schema
const genreSchema = new mongoose.Schema({
  // Genre name, required and unique
  name: {
    type: String,
    required: true,
    unique: true, // Ensure genre name is unique
    trim: true,
  },
  // Description of the genre
  description: {
    type: String,
    trim: true, // Remove whitespace from both ends
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
genreSchema.pre('save', function (next) {
  this.updated_at = Date.now(); // Set updated_at to current date and time
  next();
});

// Genre model
const Genre = mongoose.model('Genre', genreSchema);

export default Genre;
