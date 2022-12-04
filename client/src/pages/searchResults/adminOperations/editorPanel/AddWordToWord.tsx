import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import ToggleButtons from "../../../../components/ToggleButtons";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  selectCurrentTab,
  triggerChangeFlag,
} from "../../../../slices/wordSlice";

function FormDialog() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);
  const [word, setWord] = useState("");
  const [toggleButtonValue, setToggleButtonValue] = React.useState("thesaurus");
  const currentTab = useAppSelector(selectCurrentTab);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event?: any) => {
    try {
      event?.preventDefault();
    } catch {}

    axios
      .post("/api/add-word-to-word", {
        word: word,
        relation: toggleButtonValue,
        tab: currentTab._id,
      })
      .then((res) => {
        setWord("");
        dispatch(triggerChangeFlag());
      });
  };

  const handleChange = (event: any) => {
    setWord(event.target.value);
  };

  if (!currentTab) return null;

  return (
    <div>
      <Button variant="text" size="small" onClick={handleClickOpen}>
        Kelime Ekle
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Kelime Ekle</DialogTitle>
        <DialogContent>
          <Stack spacing={1}>
            <ToggleButtons
              options={[
                { name: "thesaurus" },
                { name: "similar" },
                { name: "antonymous" },
              ]}
              onChange={(option) => setToggleButtonValue(option || "thesaurus")}
            />
            <TextField
              type="text"
              onKeyUp={(event) => {
                if (event.key === "Enter") handleSubmit();
              }}
              onChange={handleChange}
              label="Yaz"
              value={word}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>İptal</Button>
          <Button type="submit" onClick={handleSubmit}>
            Ekle Gitsin
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FormDialog;
