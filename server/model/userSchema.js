const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 10,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      city: String,
      region: String,
      country: String,
      latitude: Number,
      longitude: Number,
    },
    weather: {
      temperature: Number,
      condition: String,
    },
  },{ timestamps: true });


  const User = mongoose.model('USER', userSchema);

  module.exports = User;
