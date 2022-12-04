import { useState } from "react";
import { IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Grid from "@mui/material/Grid";

import AutoCompleteSearch from "./AutoCompleteSearch";
import { useNavigate } from "react-router-dom";

function Search() {
  const navigate = useNavigate();
  const [word, setWord] = useState<String>("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const path = "/ara/" + word;
    navigate(path);
  }

  return (
    <form onSubmit={(event) => handleSubmit(event)}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={10} sm={7} lg={11}>
          <AutoCompleteSearch
            onInputChange={(event, value) => {
              setWord(value);
            }}
          />
        </Grid>
        <Grid item xs={2} sm={1} lg={1}>
          <IconButton type="submit" aria-label="delete">
            <SearchIcon fontSize="large" />
          </IconButton>
        </Grid>
      </Grid>
    </form>
  );
}

export default Search;
