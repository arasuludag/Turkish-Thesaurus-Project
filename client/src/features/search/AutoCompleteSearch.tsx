import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";

export default function ComboBox(props: {
  onInputChange(event: any, value: String): void;
}) {
  const [suggestions, setSuggestions] = useState<String[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const typedWord = event.target.value;

    if (typedWord !== undefined && typedWord.length > 0) {
      setLoading(true);
      axios.get("/api/word-suggestions/" + typedWord).then((res) => {
        setSuggestions([...res.data]);
        setLoading(false);
      });
    }
  };

  return (
    <Autocomplete
      options={suggestions}
      getOptionLabel={(option: any) => {
        if (option.word === undefined) return option;
        else return option.word;
      }}
      fullWidth
      onInputChange={props.onInputChange}
      freeSolo
      selectOnFocus
      autoComplete
      autoHighlight
      loading={loading}
      loadingText={"Yükleniyor..."}
      renderInput={(params) => (
        <TextField
          {...params}
          autoFocus={true}
          type="text"
          label="Kelime Ara"
          variant="outlined"
          onChange={(event) => handleChange(event)}
        />
      )}
    />
  );
}
