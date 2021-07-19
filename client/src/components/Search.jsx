import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import axios from "axios";

import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import Grid from "@material-ui/core/Grid";

import AutoCompleteSearch from "./AutoCompleteSearch.jsx";

function Search(props) {
  const [word, setWord] = useState("");

  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    var path = location.pathname;

    const splittedPath = path.split("/");

    if (splittedPath[2] !== undefined && splittedPath[2].length > 2) {
      axios.post("/api/word", { word: splittedPath[2] }).then((res) => {
        if (res.data === "Nope") {
          props.onResponseChange(splittedPath[2]);
        } else props.onResponseChange(res.data);
      });
    }
  }, [location.pathname]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const wordCapitalized = word.charAt(0).toUpperCase() + word.slice(1);
    history.push("/ara/" + wordCapitalized);
  };

  return (
    <Grid item xs={12} sm={7} md={7} lg={5}>
    <form onSubmit={handleSubmit}>
      <Grid container direction="row" justify="space-between" alignItems="center">
        <Grid item xs={10} sm={7} lg={11}>
          <AutoCompleteSearch
            onInputChange={(event, newInputValue) => {
              setWord(newInputValue);
            }}
            type="text"
            label="Kelime Ara"
          />
        </Grid>
        <Grid item xs={2} sm={5} lg={1}>
          <IconButton
            type="submit"
            aria-label="delete"
            style={{ color: "#650073" }}
          >
            <SearchIcon fontSize="large" />
          </IconButton>
        </Grid>
      </Grid>
    </form>
  </Grid>
  );
}

export default Search;
