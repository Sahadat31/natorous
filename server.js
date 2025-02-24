const mongoose = require('mongoose')
const {Schema, model} = mongoose
const dotenv = require('dotenv')
dotenv.config({
    path: `.env.${process.env.NODE_ENV}`
  });       // will run based on NODE_ENV mentioned in package.json script
const db = process.env.DATABASE_URL.replace('<db_password>',process.env.PASSWORD)
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
mongoose.connect(db).then(()=>{
  console.log('database connection established successfully!')
})

const app = require('./app')
// console.log(process.env)
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}`)
})