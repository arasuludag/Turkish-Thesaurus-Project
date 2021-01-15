require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const cors = require("cors");
const fs = require("fs");
const app = express();
const port = 5000;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(cors());

// For the session.
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// MongoDB stuff.
mongoose.connect("mongodb://localhost:27017/ThesaurusDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useCreateIndex", true);

//Create User Model
const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  isEditor: Boolean,
});

//Create Word Model
const wordSchema = new mongoose.Schema({
  word: String,
  tabs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tab" }],
  whoCreated: String,
});

//Create Tabs Model
const tabSchema = new mongoose.Schema({
  name: String,
  whoCreated: String,
  thesaurus: Array,
  similar: Array,
  antonymous: Array,
});

// Bind userSchema to passport for login.
userSchema.plugin(passportLocalMongoose, {
  limitAttempts: true,
  interval: 1000,
});

const User = mongoose.model("User", userSchema);
const Word = mongoose.model("Word", wordSchema);
const Tab = mongoose.model("Tab", tabSchema);

module.exports = mongoose.model("User", userSchema);

// use static authenticate method of model in LocalStrategy
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// When requested, send user info.
app.get("/api/current_user", (req, res) => {
  res.send(req.user);
});

app.post("/api/register", (req, res) => {
  if (req.body.user.code === process.env.REGISTERCODE) {
    User.register(
      {
        name: req.body.user.name,
        isEditor: false,
        username: req.body.user.username,
      },
      req.body.user.password,
      function (err, user) {
        if (err) {
          console.log(err);
        } else {
          res.send("OK");
        }
      }
    );
  } else res.status(406);
});

app.post(
  "/api/login",
  passport.authenticate("local", { successRedirect: "/" })
);

app.post("/api/word", (req, res) => {
  Word.findOne({ word: req.body.word }, function (err, foundWord) {
    if (err) console.log(err);
    else if (foundWord === null) {
      res.send("Nope");
    } else {
      res.send(foundWord);
    }
  });
});

app.post("/api/word-suggestions", (req, res) => {
  Word.find({ word: { $regex: req.body.word, $options: "si" } }, function (
    err,
    foundWord
  ) {
    if (err) console.log(err);
    else {
      res.send(foundWord);
    }
  }).limit(7);
});

app.post("/api/tabs", (req, res) => {
  Word.findOne({ word: req.body.word }, function (err, foundWord) {
    if (err) console.log(err);
    else if (foundWord === null) {
      res.send("Nope");
    } else {
      Tab.find(
        {
          _id: foundWord.tabs,
        },
        function (err, foundTabs) {
          if (err) console.log(err);
          else {
            res.send(foundTabs);
          }
        }
      );
    }
  });
});

app.post("/api/add-word", (req, res) => {
  if (req.isAuthenticated() && req.user.isEditor) {
    Tab.create(
      {
        name: "Genel",
        whoCreated: req.user._id,
      },
      function (err, tab) {
        if (err) console.log(err);
        else {
          tab.save();

          Word.create(
            {
              word: req.body.word,
              whoCreated: req.user._id,
            },
            function (err, word) {
              if (err) console.log(err);
              else {
                word.tabs.push(tab._id);
                word.save();
                res.status(200).send("OK");
              }
            }
          );
        }
      }
    );
  }
});

app.post("/api/add-word-to-word", (req, res) => {
  if (req.isAuthenticated() && req.user.isEditor) {
    Tab.findById(req.body.addedWord.tab, function (err, tab) {
      if (err) console.log(err);
      else {
        if (req.body.addedWord.relation === "thesaurus")
          tab.thesaurus.push(req.body.addedWord.word);
        if (req.body.addedWord.relation === "similar")
          tab.similar.push(req.body.addedWord.word);
        if (req.body.addedWord.relation === "antonymous")
          tab.antonymous.push(req.body.addedWord.word);

        tab.save();
        res.status(200).send("OK");
      }
    });
  }
});

app.post("/api/add-tab", (req, res) => {
  if (req.isAuthenticated() && req.user.isEditor) {
    Word.findById(req.body.addedTab.wordId, function (err, foundWord) {
      if (err) console.log(err);
      else {
        Tab.create(
          {
            name: req.body.addedTab.tabName,
            whoCreated: req.user._id,
          },
          function (err, tab) {
            if (err) console.log(err);
            else {
              tab.save();
              foundWord.tabs.push(tab._id);
              foundWord.save();
              res.status(200).send("OK");
            }
          }
        );
      }
    });
  }
});

app.post("/api/delete-word", (req, res) => {
  if (req.isAuthenticated() && req.user.isEditor) {
    Tab.findById(req.body.deletedWord.tab, function (err, tab) {
      if (err) console.log(err);
      else {
        for (var i = 0; i < tab.thesaurus.length; i++) {
          if (tab.thesaurus[i] === req.body.deletedWord.word) {
            tab.thesaurus.splice(i, 1);
          }
        }
        for (var i = 0; i < tab.similar.length; i++) {
          if (tab.similar[i] === req.body.deletedWord.word) {
            tab.similar.splice(i, 1);
          }
        }
        for (var i = 0; i < tab.antonymous.length; i++) {
          if (tab.antonymous[i] === req.body.deletedWord.word) {
            tab.antonymous.splice(i, 1);
          }
        }

        tab.save();
        res.status(200).send("OK");
      }
    });
  }
});

app.post("/api/delete-tab", (req, res) => {
  if (req.isAuthenticated() && req.user.isEditor) {
    Tab.findByIdAndDelete(req.body.tabId, function (err) {
      if (err) console.log(err);
      else {
        res.status(200).send("OK");
      }
    });
  }
});

app.post("/api/delete-searchable-word", (req, res) => {
  if (req.isAuthenticated() && req.user.isEditor) {
    Word.findOne({ word: req.body.word }, function (err, foundWord) {
      if (err) console.log(err);
      else {
        const query = foundWord.tabs.map(async (tab) => {
          deleteTab = await Tab.findByIdAndDelete(tab._id).exec();
        });

        Promise.all(query).then(async () => {
          deleteWord = await Word.findByIdAndDelete(foundWord._id).exec();
          res.status(200).send("OK");
        });
      }
    });
  }
});

app.post("/api/make-editor", (req, res) => {
  if (req.isAuthenticated() && req.user.isEditor) {
    User.findOneAndUpdate(
      { username: req.body.email },
      { isEditor: true },
      function (err, foundUser) {
        if (err) console.log(err);
        else {
          res.send("OK");
        }
      }
    );
  }
});

app.post("/api/generated-words", (req, res) => {
  Word.findOne({ word: req.body.word }, async function (err, foundWord) {
    if (err) console.log(err);
    else if (foundWord === null) {
      res.send("Nope");
    } else {
      tab = await Tab.findById(foundWord.tabs[0]).exec();

      var generatedThesaurus = [];
      var i;
      const wordsT = tab.thesaurus.map(async (word) => {
        foundThesaurusWord = await Word.findOne({ word: word }).exec();
        if (foundThesaurusWord) {
          foundTab = await Tab.findById(foundThesaurusWord.tabs[0]).exec();

          foundTab.thesaurus.map((word) => {
            generatedThesaurus.push(word);
          });
        }
      });

      var generatedSimilar = [];
      const wordsS = tab.similar.map(async (word) => {
        foundSimilarWord = await Word.findOne({ word: word }).exec();
        if (foundSimilarWord) {
          foundTab = await Tab.findById(foundSimilarWord.tabs[0]).exec();

          foundTab.thesaurus.map((word) => {
            generatedSimilar.push(word);
          });
        }
      });

      var generatedAntonymous = [];
      const wordsA = tab.antonymous.map(async (word) => {
        foundAntonymousWord = await Word.findOne({ word: word }).exec();
        if (foundAntonymousWord) {
          foundTab = await Tab.findById(foundAntonymousWord.tabs[0]).exec();

          foundTab.thesaurus.map((word) => {
            generatedAntonymous.push(word);
          });
        }
      });

      Promise.all(wordsT).then(() => {
        Promise.all(wordsS).then(() => {
          Promise.all(wordsA).then(() => {
            var generated = {
              thesaurus: generatedThesaurus,
              similar: generatedSimilar,
              antonymous: generatedAntonymous,
            };

            res.send(generated);
          });
        });
      });
    }
  });
});

app.post("/api/get-sample-usage", (req, res) => {
  fs.readFile("./AD.json", "utf8", (err, readFile) => {
    if (err) console.log("File read failed:", err);
    else {
      var results = [];
      var searchField = "Soz";
      var searchVal = " " + req.body.word.toLowerCase();
      var theJSON = JSON.parse(readFile);

      const jsonSearch = theJSON.map(async (json) => {
        if (json[searchField].includes(searchVal)) {
          results.push(json);
        }
      });

      Promise.all(jsonSearch).then(() => {
        res.send(results);
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
