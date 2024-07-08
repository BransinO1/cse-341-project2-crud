const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
  // Fields for local (email/password) users
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, unique: true }, // Only required for local users
  password: { type: String }, // Only required for local users
  dateOfBirth: { type: Date },
  address: { type: addressSchema },
  
  // Fields for OAuth users (e.g., Google)
  googleId: { type: String, unique: true }, // Required for OAuth users
  displayName: { type: String }, // Display name from OAuth provider
  // Add other fields as needed for OAuth users

  // Common fields
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

