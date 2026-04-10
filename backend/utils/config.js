require('dotenv').config()

const PORT = process.env.PORT
const URI = process.env.URI

module.exports = {
  URI,
  PORT
}