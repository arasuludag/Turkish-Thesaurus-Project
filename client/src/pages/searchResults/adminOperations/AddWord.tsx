import React from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectCurrentUser } from "../../../slices/userSlice";
import {
  selectWordResults,
  triggerChangeFlag,
} from "../../../slices/wordSlice";

function AddWord() {
  const currentUser = useAppSelector(selectCurrentUser);
  const wordResult = useAppSelector(selectWordResults);
  const dispatch = useAppDispatch();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    axios.post("/api/add-word", { word: wordResult.word }).then((res) => {
      dispatch(triggerChangeFlag());
    });
  };
  if (currentUser === "" || !currentUser?.isEditor) return null;
  else
    return (
      <form onSubmit={handleSubmit}>
        <Button variant="contained" size="large" type="submit">
          Ekleyeyim Bari
        </Button>
      </form>
    );
}

export default AddWord;
