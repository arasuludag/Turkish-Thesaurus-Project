/* eslint-disable no-use-before-define */
import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import axios from "axios";
import { withStyles, makeStyles } from "@material-ui/core/styles";

const CustomTextField = withStyles({
  root: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#650073",
      },
      "&:hover fieldset": {
        borderColor: "#A900BF",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#650073",
      },
    },
    "& label.Mui-focused": {
      color: "purple",
    },
  },
})(TextField);

const CustomAutocomplete = withStyles({
  paper: {
    backgroundColor: "#222831"
  },
  clearIndicator: {
    color: "purple",
  },
  "@global": {
    '.MuiAutocomplete-option[data-focus="true"]': {
      background: "linear-gradient(90deg, #4F0059 0%, rgba(34,40,49,1) 80%)",
      borderRadius: "10px",
    },
  },
  option: {
    backgroundColor: "#222831",
  },
})(Autocomplete);

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

export default function ComboBox(props) {
  const classes = useStyles();

  const [word, setWord] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setWord(event.target.value);

    setSuggestions([]);

    if (word !== "" || (word !== undefined && word.length > 2)) {
      setLoading(true);
      axios.post("/api/word-suggestions", { word: word }).then((res) => {
        setSuggestions([...res.data]);
        setLoading(false);
      });
    }
  };

  return (
    <CustomAutocomplete
      options={suggestions}
      getOptionLabel={(option) => {if (option.word === undefined) return option; else return option.word;}}
      fullWidth
      inputValue={props.inputValue}
      onInputChange={props.onInputChange}
      freeSolo
      selectOnFocus
      autoComplete
      autoHighlight
      loading={loading}
      loadingText={"Bekle biraz..."}
      renderInput={(params) => (
        <CustomTextField
          {...params}
          className={classes.margin}
          autoFocus={true}
          type={props.type}
          label={props.label}
          variant="outlined"
          onChange={props.onChange}
          onInput={handleChange}
        />
      )}
    />
  );
}
