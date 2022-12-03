import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  selectWordResults,
  triggerChangeFlag,
} from "../../../search/wordSlice";

function FormDialog() {
  const dispatch = useAppDispatch();
  const word = useAppSelector(selectWordResults);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [tabName, setTabName] = useState("");
  const [tabClause, setTabClause] = useState("");

  const handleSubmit = (event: any) => {
    event.preventDefault();

    axios
      .post("/api/add-tab", {
        wordId: word.wordID,
        tabName: tabName,
        tabClause: tabClause,
      })
      .then((res) => {
        dispatch(triggerChangeFlag());
      });
  };

  const handleTabNameChange = (event: any) => {
    setTabName(event.target.value);
  };
  const handleTabClauseChange = (event: any) => {
    setTabClause(event.target.value);
  };

  return (
    <div>
      <Button variant="contained" size="small" onClick={handleClickOpen}>
        Sekme Ekle
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="form-dialog-title">Sekme Ekle</DialogTitle>
        <DialogContent>
          <TextField
            type="text"
            onChange={handleTabClauseChange}
            label="Clause"
          />
          <TextField
            type="text"
            onChange={handleTabNameChange}
            label="Sekme Adı"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>İptal</Button>
          <Button onClick={handleSubmit}>Ekle Gitsin</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FormDialog;
