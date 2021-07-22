import React, { useState, useEffect } from "react";
import axios from "axios";

import Grid from "@material-ui/core/Grid";

import AddWordtoWord from "./AddWordtoWord.jsx";
import AddTab from "./AddTab.jsx";
import DeleteWord from "./DeleteWord.jsx";
import DeleteTab from "./DeleteTab.jsx";
import DeleteSearchableWord from "./DeleteSearchableWord.jsx";
import MakeEditor from "./MakeEditor.jsx";
import WordOrderChange from "./WordOrderChange.jsx";

function EditorPanel(props) {
  const [data, setData] = useState("");

  useEffect(() => {
    axios.get("/api/current_user").then((res) => {
      setData(res.data);
    });
  }, []);

  if (!data.isEditor) return null;
  else
    return (
      <Grid container direction="row" justify="center" alignItems="flex-end">
        <AddWordtoWord tabData={props.tabData} index={props.value} />
        <WordOrderChange tabData={props.tabData} />
        <AddTab wordData={props.wordData} />
        <DeleteWord tabData={props.tabData} />
        <DeleteTab tabData={props.tabData} wordData={props.wordData} />
        <DeleteSearchableWord />
        <MakeEditor />
      </Grid>
    );
}

export default EditorPanel;
