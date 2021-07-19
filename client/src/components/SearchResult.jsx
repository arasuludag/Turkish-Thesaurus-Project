import React, { useState, useEffect } from "react";
import axios from "axios";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import AddWord from "./AddWord.jsx";
import Tabs from "./Tabs.jsx";
import ShowSampleUsage from "./ShowSampleUsage.jsx";

function SearchResult(props) {
  const [genWords, setGenWords] = useState("");

  useEffect(() => {
    axios
      .post("/api/generated-words", { word: props.word.word })
      .then((res) => {
        setGenWords(res.data);
      });

    if (props.word.word !== undefined) document.title = props.word.word;
    else document.title = "TResaurus";
  }, [props.word]);

  function checkData() {
    if (props.word === undefined || props.word === "") return null;
    else if (props.word.word === undefined)
      return (
        <Paper elevation={3} className="smoothbackground">
          <h3>
            {props.word} diye bir şey şimdilik yok. Olması gerekiyorsa yakında
            eklenecektir.
          </h3>
          <AddWord word={props.word} />
        </Paper>
      );
    else
      return (
        <div>
          <Paper elevation={3} className="smoothbackground">
            <h1 style={{ textAlign: "center" }}>{props.word.word}</h1>
            <Tabs
              tabData={props.word.tabs}
              wordData={props.word}
              genWords={genWords}
            />
          </Paper>

          <ShowSampleUsage wordData={props.word} />
        </div>
      );
  }

  return (
    <Grid item xs={12} lg={6}>
      {checkData()}
    </Grid>
  );
}

export default SearchResult;
