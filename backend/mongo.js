const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const url = process.env.URI;

mongoose.connect(url).then(() => {
  console.log("Database connected");
});