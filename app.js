require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const app = express();
const cors = require("cors");
const port = 5000;

//Public folder usage and bodyParser.
app.use(express.static(__dirname + "/public")); // This was more relevant with EJS. I just left it as it is.
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(cors());

// For the cookies, user and password salt & hash.
app.use(
  session({
    secret: "process.env.SECRET",
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
  tabs: Array,
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
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
const Word = mongoose.model("Word", wordSchema);
const Tab = mongoose.model("Tab", tabSchema);

// More boilerplate for passport. (User login)
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// When requested, send user info.
app.get("/api/current_user", (req, res) => {
  res.send(req.user);
});

app.post("/api/register", (req, res) => {
  User.register(
    {
      name: req.body.user.name,
      isEditor: true,
      username: req.body.user.username,
    },
    req.body.user.password,
    function (err, user) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send("OK");
      }
    }
  );
});

app.post("/api/login", (req, res) => {
  const user = new User({
    username: req.body.user.username,
    password: req.body.user.password,
  });

  req.logIn(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      res.status(200).send("OK");
    }
  });
});

app.post("/api/word", (req, res) => {
  Word.findOne({ word: req.body.searchedWord.word }, function (err, foundWord) {
    if (err) console.log(err);
    else if (foundWord === null) {
      res.send("Nope");
    } else {
      res.send(foundWord);
    }
  });
});

app.post("/api/word-suggestions", (req, res) => {
  Word.find({ word: { $regex: req.body.searchedWord.word, $options: "i" } }, function (err, foundWord) {
    if (err) console.log(err);
    else {
      res.send(foundWord);
    }
  });
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
  if (req.isAuthenticated()) {
    User.findById(req.user.id, function (err, foundUser) {
      if (err) console.log(err);
      else {
        Tab.create(
          {
            name: "Genel",
            whoCreated: foundUser._id,
          },
          function (err, tab) {
            if (err) console.log(err);
            else {
              tab.save();

              Word.create(
                {
                  word: word,
                  whoCreated: foundUser._id,
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
  }
});

app.post("/api/add-word-to-word", (req, res) => {
  if (req.isAuthenticated()) {
    User.findById(req.user.id, function (err, foundUser) {
      if (err) console.log(err);
      else {
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
  }
});

app.post("/api/add-tab", (req, res) => {
  if (req.isAuthenticated()) {
    User.findById(req.user.id, function (err, foundUser) {
      if (err) console.log(err);
      else {
        Word.findById(req.body.addedTab.wordId, function (err, foundWord) {
          if (err) console.log(err);
          else {
            Tab.create(
              {
                name: req.body.addedTab.tabName,
                whoCreated: foundUser._id,
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
  }
});

app.post("/api/delete-word", (req, res) => {
  if (req.isAuthenticated()) {
    User.findById(req.user.id, function (err, foundUser) {
      if (err) console.log(err);
      else {
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
  }
});

app.post("/api/delete-tab", (req, res) => {
  if (req.isAuthenticated()) {
    User.findById(req.user.id, function (err, foundUser) {
      if (err) console.log(err);
      else {
        Tab.findByIdAndDelete(req.body.tabId, function (err) {
          if (err) console.log(err);
          else {
            res.status(200).send("OK");
          }
        });
      }
    });
  }
});

app.post("/api/delete-searchable-word", (req, res) => {
  if (req.isAuthenticated()) {
    User.findById(req.user.id, function (err, foundUser) {
      if (err) console.log(err);
      else {
        Word.findOneAndDelete({ word: req.body.word }, function (err) {
          if (err) console.log(err);
          else {
            res.status(200).send("OK");
          }
        });
      }
    });
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

            console.log(generated);

            res.send(generated);
          });
        });
      });
    }
  });
});


//
// app.get('/api/get-tasks', (req, res) => {
//   if (req.isAuthenticated()) {
//
//     User.findById(req.user.id, function(err, foundUser) {
//       if (err) console.log(err);
//
//       Task.find({
//         translator: foundUser._id
//       }, function(err, foundTask) {
//         if (err) console.log(err);
//         else { res.status(200).send(foundTask);}
//     });
// });
//   }
// })
//
// var taskId;
// app.post('/api/display-task', (req, res) => {
// if (req.isAuthenticated()) {
//
//   taskId = req.body.task.taskId;
//   res.status(200).send('OK');
//
// }
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
