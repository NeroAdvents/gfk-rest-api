const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

UserSchema.plugin(AutoIncrement, {inc_field: 'id_user'});
module.exports = mongoose.model("user", UserSchema);