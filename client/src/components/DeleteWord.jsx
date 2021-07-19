import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";

import RadioDeleteButton from "./RadioDeleteButton.jsx";
import Snackbar from "./Snackbar.jsx";

const CustomDialog = withStyles({
  paper: {
    backgroundColor: "#1c1d26",
  },
})(Dialog);

function FormDialog(props) {

  const [open, setOpen] = React.useState(false);
  const [tabId, setTabId] = useState("");
  const [word, setWord] = useState("");
  const [snackbar, setSnackbar] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const history = useHistory();
  const handleClose = () => {
    history.push("/");
    history.goBack();
    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const deletedWord = {
      word: word,
      tab: tabId,
    };

    if (deletedWord.word !== "") {
      axios.post("/api/delete-word", { deletedWord }).then((res) => {
          setSnackbar(true);
      });
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        size="small"
        onClick={handleClickOpen}
        style={{
          backgroundColor: "#650073",
          color: "white",
          borderRadius: "33px",
          marginTop: "15px",
        }}
      >
        Kelime Sil
      </Button>
      <CustomDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Kelime Sil</DialogTitle>
        <DialogContent>
          <RadioDeleteButton
            tabData={props.tabData}
            deleteThis={(word, tabId) => {
              setWord(word);
              setTabId(tabId);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            İptal
          </Button>
          <Button onClick={handleSubmit} color="secondary">
            Sil Gitsin
          </Button>
        </DialogActions>
      </CustomDialog>
      <Snackbar snackbar = {snackbar} setSnackbar={(bool) => {setSnackbar(bool);}}/>
    </div>
  );
}

export default FormDialog;
