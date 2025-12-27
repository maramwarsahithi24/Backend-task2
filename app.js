require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const path = require('path');
const authRoutes = require('./routes/auth');
const staticpath = require('./staticroutes');

const connectingToMongodb = require('./connection');
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/authorization',authRoutes);
app.use('/',staticpath);

app.set("view engine","ejs");
app.set("views", path.resolve("views"))

connectingToMongodb("mongodb://127.0.0.1:27017/syntaxhub2")
  .then(() => {
    console.log("MongoDB connected");
    const mongoose = require("mongoose");
    const db = mongoose.connection.db;
    db.collection("temp").insertOne(
      {
        fake: true,
        message: "This is a temporary document to make the database appear",
      },
      (err, result) => {
        if (err) {
          console.log("Error inserting fake document:", err);
        } else {
          console.log(
            "Fake document inserted - database should now appear in mongosh"
          );
          db.collection("temp").deleteOne({ fake: true }, (err, result) => {
            if (err) {
              console.log("Error deleting fake document:", err);
            } else {
              console.log("Fake document deleted");
            }
          });
        }
      }
    );
  })
  .catch((err) => {
    console.log("DB connection error:", err);
  });


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});