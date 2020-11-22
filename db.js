const mongoose = require("mongoose");

require('dotenv').config();

const MongoUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWD}@gfk-rn.6i54x.mongodb.net/gfk-rn?retryWrites=true&w=majority`;

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to DB !!");
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports = InitiateMongoServer;
