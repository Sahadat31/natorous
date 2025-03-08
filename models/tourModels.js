const mongoose = require('mongoose')
const {Schema, model} = mongoose

const tourSchema = new Schema({
  name: {
    type: String,
    required: [true, 'A tour should always have a name'],
    unique: true,
    trim: true,
    minLength: [5,'A tour name must have at least 5 characters'],
    maxLength: [40, 'A tour name must not have more than 40 characters']
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
    required: [true, 'A tour must have a difficulty level'],
    enum: {
      values: ['easy','medium','difficult'],
      message: 'Difficulty can either be easy,medium or hard'
    }
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  ratingsAverage: {
    type: Number,
    default: 4,
    min: [1.0, 'Rating average should be more than or equal to 1'],
    max: [5.0, 'Rating average can not be more than 5']
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