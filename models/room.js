const mongoose = require('mongoose')

const Room = mongoose.model('Room', {
  title: String,
  description: String,
  photos: [String],
  price: Number,
  ratingValue: {
    type: Number,
    default: null
  },
  reviews: {
    type: Number,
    default: 0
  },
  city: String,
  loc: {
    type: [Number],
    index: '2dsphere'
  }
})

module.exports = Room
