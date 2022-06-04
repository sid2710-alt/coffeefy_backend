const mongoose = require("mongoose");

const mongodb = process.env.DB_CONN;
const server = mongoose
  .connect(mongodb, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("database is now connected");
  });

module.exports = server;
