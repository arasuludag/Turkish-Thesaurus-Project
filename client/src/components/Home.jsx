import React, { useState } from "react";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

import Search from "./Search.jsx";
import SearchResult from "./SearchResult.jsx";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    borderRadius: "10px",
    padding: "20px",
    marginTop: "20px",
    marginRight: "10px",
    marginLeft: "10px",
    backgroundColor: "#222831",
  },
}));

function Home() {
  const classes = useStyles();

  const [word, setWord] = useState("");

  return (
    <div className="Squezer">
      <Grid container direction="row" justify="center" alignItems="flex-start">
        <Grid item xs={12} lg={7}>
          <Paper elevation={3} className={classes.root}>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid item xs={5} lg={4}>
                <h1 style={{ textAlign: "center" }}>TResaurus</h1>
              </Grid>
              <Search
                onResponseChange={(newWord) => {
                  setWord(newWord);
                }}
              />
            </Grid>
          </Paper>
        </Grid>
        <SearchResult word={word} />
      </Grid>
    </div>
  );
}

export default Home;
