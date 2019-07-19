const mongoose = require('mongoose')

const User = mongoose.model('User', {
  account: {
    username: {
      type: String,
      unique: true
    },
    biography: String
  },
  email: {
    type: String,
    unique: true
  },
  token: String,
  hash: String,
  salt: String
})

module.exports = User
