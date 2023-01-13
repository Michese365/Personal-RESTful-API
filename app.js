const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const _ = require("lodash");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.set("strictQuery", false);

// Connect database to localhost.
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

// Create a db schema.
const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

// Create a db model.
const Article = mongoose.model("article", articleSchema);

///////////////////////////////// Request targeting all articles. /////////////////////////////////////////////////
app
  .route("/articles")

  // Fetch all the articles.
  .get((req, res) => {
    // Find all the articles in the db.
    Article.find((err, results) => {
      if (!err) {
        res.send(results);
      } else {
        res.send(err);
      }
    });
  })

  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save((err) => {
      if (!err) {
        res.send("Succesfully added a new article.");
      } else {
        res.send(err);
      }
    });
  })

  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send("Succesfully deleted all the articles.");
      } else {
        res.send(err);
      }
    });
  });

///////////////////////////////// Request targeting specific articles. /////////////////////////////////////////////////
app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, result) => {
      if (result) {
        res.send(result);
      } else {
        res.send("No article was found.");
      }
    });
  })
  .put((req, res) => {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      (err) => {
        if (!err) {
          res.send("Updated Successfully");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch((req, res) => {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { $set: req.body },
      (err) => {
        if (!err) {
          res.send("Patched Successfully.");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete((req, res) => {
    Article.findOneAndDelete({ title: req.params.articleTitle }, (err) => {
      if (!err) {
        res.send("Deleted Successfully.");
      } else {
        res.send(err);
      }
    });
  });

// Listening port.
app.listen(3000, (req, res) => {
  console.log("Server running on port 3000!");
});
