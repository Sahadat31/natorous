const mongoose = require('mongoose')
const {Schema, model} = mongoose

const tourSchema = new Schema({
  name: {
    type: String,
    required: [true, 'A tour should always have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4
  },
  price: {
    type: Number,
    required: [true, 'A tour should always have a price']
  }
})
const Tour = model('Tour',tourSchema)
module.exports = Tour;