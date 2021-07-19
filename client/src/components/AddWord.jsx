import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

import Button from "@material-ui/core/Button";

function AddWord(props) {
  const [data, setData] = useState("");

  useEffect(() => {
    axios.get("/api/current_user").then((res) => {
      setData(res.data);
    });
  }, []);

  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post("/api/add-word", { word: props.word }).then((res) => {
      history.push("/");
      history.push("/ara/" + props.word);
    });
  };
  if (!data.isEditor) return null;
  else
    return (
      <form onSubmit={handleSubmit}>
        <Button
          variant="contained"
          size="large"
          type="submit"
          style={{
            backgroundColor: "#DC3522",
            color: "#fff",
            borderRadius: "10px",
          }}
        >
          Ekleyeyim Bari
        </Button>
      </form>
    );
}

export default AddWord;
