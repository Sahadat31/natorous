const mongoose = require('mongoose')
const {Schema, model} = mongoose

const tourSchema = new Schema({
  name: {
    type: String,
    required: [true, 'A tour should always have a name'],
    unique: true,
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a groupSize']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty level']
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  ratingsAverage: {
    type: Number,
    default: 4
  },
  price: {
    type: Number,
    required: [true, 'A tour should always have a price']
  },
  priceDiscount: {
    type: Number
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a summary']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a image Cover']
  },
  images: {
    type: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  startDates: {
    type: [Date]
  }
})
const Tour = model('Tour',tourSchema)
module.exports = Tour;