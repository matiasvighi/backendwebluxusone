const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    email: { type: String, unique: true },
    password: { type: String },
    admin: { type: Boolean, default: null },
    active_user: { type: Boolean, default: null },
    
    token: { type: String },

  });
  
  module.exports = mongoose.model("user", userSchema);
  