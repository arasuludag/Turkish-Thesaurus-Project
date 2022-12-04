require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");

const cors = require("cors");
const fs = require("fs");
const app = express();
const port = 5000;
let sitemap;

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

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
mongoose.connect(process.env.MONGO, {
  useFindAndModify: false,
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
  tabs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tab",
    },
  ],
  whoCreated: String,
});

//Create Tabs Model
const tabSchema = new mongoose.Schema({
  name: String,
  clause: String,
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
  if (req.body.code === process.env.REGISTERCODE) {
    var isEditor = false;
    if (process.env.ADMIN === req.body.username) isEditor = true;

    User.register(
      {
        name: req.body.name,
        isEditor: isEditor,
        username: req.body.username,
      },
      req.body.password,
      function (err, user) {
        if (err) {
          res.status(409).send(); // If exists.
        } else {
          res.status(201).send();
        }
      }
    );
  } else res.status(401).send();
});

app.post(
  "/api/login",
  passport.authenticate("local", {
    failureMessage: true,
  }),
  function (req, res) {
    res.status(200).send();
  }
);

app.get("/api/word/:word", async (req, res) => {
  const foundWord = await Word.findOne(
    {
      word: req.params.word,
    },
    "word tabs"
  )
    .populate("tabs", "name clause thesaurus similar antonymous")
    .exec();

  if (foundWord === null) {
    res.status(204).send();
  } else {
    res.send(foundWord);
  }
});

app.get("/api/word-suggestions/:word", (req, res) => {
  Word.find(
    {
      word: {
        $regex: req.params.word,
        $options: "si",
      },
    },
    function (err, foundWord) {
      if (err) console.log(err);
      else {
        res.send(foundWord);
      }
    }
  ).limit(20);
});

app.post("/api/add-word", (req, res) => {
  if (!req.user?.isEditor) return res.status(401).send();

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
              res.status(201).send();
            }
          }
        );
      }
    }
  );
});

app.post("/api/add-word-to-word", (req, res) => {
  if (!req.user?.isEditor) return res.status(401).send();

  Tab.findById(req.body.tab, function (err, tab) {
    if (err) console.log(err);
    else {
      if (req.body.relation === "thesaurus") tab.thesaurus.push(req.body.word);
      if (req.body.relation === "similar") tab.similar.push(req.body.word);
      if (req.body.relation === "antonymous")
        tab.antonymous.push(req.body.word);

      tab.save();
      res.status(201).send();
    }
  });
});

app.post("/api/change-word-order", (req, res) => {
  if (!req.user?.isEditor) return res.status(401).send();

  Tab.findById(req.body.changedWord.tab, function (err, tab) {
    if (err) console.log(err);
    else {
      Array.prototype.move = function (from, to) {
        this.splice(to, 0, this.splice(from, 1)[0]);
      };

      switch (req.body.changedWord.type) {
        case "Thesaurus":
          thesaurusOrder = tab.thesaurus.indexOf(req.body.changedWord.word);
          tab.thesaurus.move(thesaurusOrder, req.body.changedWord.order - 1);
          break;
        case "Similar":
          similarOrder = tab.similar.indexOf(req.body.changedWord.word);
          tab.similar.move(similarOrder, req.body.changedWord.order - 1);
          break;
        case "Antonymous":
          antonymousOrder = tab.antonymous.indexOf(req.body.changedWord.word);
          tab.antonymous.move(antonymousOrder, req.body.changedWord.order - 1);
          break;
        default:
          return res.status(400).send();
      }

      tab.save();
      res.status(200).send("OK");
    }
  });
});

app.post("/api/add-tab", (req, res) => {
  if (!req.user?.isEditor) return res.status(401).send();

  Word.findById(req.body.wordId, function (err, foundWord) {
    if (err) console.log(err);
    else {
      Tab.create(
        {
          name: req.body.tabName,
          clause: req.body.tabClause,
          whoCreated: req.user._id,
        },
        function (err, tab) {
          if (err) console.log(err);
          else {
            tab.save();
            foundWord.tabs.push(tab._id);
            foundWord.save();
            res.status(201).send();
          }
        }
      );
    }
  });
});

app.delete("/api/wordFromTab/:tabID/:word", (req, res) => {
  if (!req.user?.isEditor) return res.status(401).send();

  Tab.findById(req.params.tabID, function (err, tab) {
    if (err) console.log(err);
    else {
      for (var i = 0; i < tab.thesaurus.length; i++) {
        if (tab.thesaurus[i] === req.params.word) {
          tab.thesaurus.splice(i, 1);
        }
      }
      for (var i = 0; i < tab.similar.length; i++) {
        if (tab.similar[i] === req.params.word) {
          tab.similar.splice(i, 1);
        }
      }
      for (var i = 0; i < tab.antonymous.length; i++) {
        if (tab.antonymous[i] === req.params.word) {
          tab.antonymous.splice(i, 1);
        }
      }

      tab.save();
      res.status(204).send();
    }
  });
});

app.delete("/api/tab/:tabID", (req, res) => {
  if (!req.user?.isEditor) return res.status(401).send();

  Tab.findByIdAndDelete(req.params.tabID, function (err) {
    if (err) console.log(err);
    else {
      res.status(204).send();
    }
  });
});

app.delete("/api/searchable_word/:word", (req, res) => {
  if (!req.user?.isEditor) return res.status(401).send();

  Word.findOne(
    {
      word: req.params.word,
    },
    function (err, foundWord) {
      if (err) console.log(err);
      if (foundWord === null) res.status(404);
      else {
        const query = foundWord.tabs.map(async (tab) => {
          deleteTab = await Tab.findByIdAndDelete(tab._id).exec();
        });

        Promise.all(query).then(async () => {
          deleteWord = await Word.findByIdAndDelete(foundWord._id).exec();
          res.status(204).send();
        });
      }
    }
  );
});

app.patch("/api/makeEditor", (req, res) => {
  if (!req.user?.isEditor) return res.status(401).send();

  User.findOneAndUpdate(
    {
      username: req.body.email,
    },
    {
      isEditor: true,
    },
    function (err, foundUser) {
      if (err) console.log(err);
      else {
        res.status(204).send();
      }
    }
  );
});

// app.post("/api/generated-words", (req, res) => {
//   Word.findOne(
//     {
//       word: req.body.word,
//     },
//     async function (err, foundWord) {
//       if (err) console.log(err);
//       else if (foundWord === null) {
//         res.status(204).send("No Content");
//       } else {
//         const tab = await Tab.findById(foundWord.tabs[0]).exec();

//         var generatedThesaurus = [];
//         const wordsT = tab.thesaurus.map(async (word) => {
//           foundThesaurusWord = await Word.findOne({
//             word: word,
//           }).exec();
//           if (foundThesaurusWord) {
//             foundTab = await Tab.findById(foundThesaurusWord.tabs[0]).exec();

//             foundTab.thesaurus.map((word) => {
//               generatedThesaurus.push(word);
//             });
//           }
//         });

//         var generatedSimilar = [];
//         const wordsS = tab.similar.map(async (word) => {
//           foundSimilarWord = await Word.findOne({
//             word: word,
//           }).exec();
//           if (foundSimilarWord) {
//             foundTab = await Tab.findById(foundSimilarWord.tabs[0]).exec();

//             foundTab.thesaurus.map((word) => {
//               generatedSimilar.push(word);
//             });
//           }
//         });

//         var generatedAntonymous = [];
//         const wordsA = tab.antonymous.map(async (word) => {
//           foundAntonymousWord = await Word.findOne({
//             word: word,
//           }).exec();
//           if (foundAntonymousWord) {
//             foundTab = await Tab.findById(foundAntonymousWord.tabs[0]).exec();

//             foundTab.thesaurus.map((word) => {
//               generatedAntonymous.push(word);
//             });
//           }
//         });

//         Promise.all(wordsT).then(() => {
//           Promise.all(wordsS).then(() => {
//             Promise.all(wordsA).then(() => {
//               var generated = {
//                 thesaurus: generatedThesaurus,
//                 similar: generatedSimilar,
//                 antonymous: generatedAntonymous,
//               };

//               res.send(generated);
//             });
//           });
//         });
//       }
//     }
//   );
// });

app.get("/api/sample_usage/:word", (req, res) => {
  fs.readFile("./AD.json", "utf8", (err, readFile) => {
    if (err) console.log("File read failed:", err);
    else {
      var results = [];
      var searchField = "Soz";
      var searchVal = " " + req.params.word.toLowerCase();
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

app.get("/sitemap.xml", async function (req, res) {
  res.header("Content-Type", "application/xml");
  res.header("Content-Encoding", "gzip");
  // if we have a cached entry send it
  if (sitemap) {
    res.send(sitemap);
    return;
  }

  try {
    const smStream = new SitemapStream({
      hostname: "https://tresaurus.app",
    });
    const pipeline = smStream.pipe(createGzip());

    smStream.write({
      url: "/",
      priority: 0.8,
    });

    const foundWord = await Word.find({}).exec();

    theMapping = foundWord.map((word) => {
      // pipe your entries or directly write them.
      smStream.write({
        url: "/ara/" + word.word,
        changefreq: "monthly",
        priority: 0.3,
      });
    });

    Promise.all(theMapping).then(() => {
      // cache the response
      streamToPromise(pipeline).then((sm) => (sitemap = sm));
      // make sure to attach a write stream such as streamToPromise before ending
      smStream.end();
      // stream write the response
      pipeline.pipe(res).on("error", (e) => {
        throw e;
      });
    });
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
});

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}!`);
});
