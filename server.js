const dotenv = require('dotenv')
dotenv.config({
    path: `.env.${process.env.NODE_ENV}`
  });       // will run based on NODE_ENV mentioned in package.json script
const app = require('./app')
// console.log(process.env)
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}`)
})