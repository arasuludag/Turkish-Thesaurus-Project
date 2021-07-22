import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";

import Input from "./Input.jsx";
import RadioButton from "./RadioButton.jsx";
import Snackbar from "./Snackbar.jsx";

const CustomDialog = withStyles({
  paper: {
    backgroundColor: "#1c1d26",
  },
})(Dialog);

function FormDialog(props) {

  const [open, setOpen] = React.useState(false);
  const [radio, setRadio] = useState("");
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

  const [word, setWord] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const addedWord = {
      word: word,
      relation: radio,
      tab: props.tabData[props.index]._id,
    };

    axios.post("/api/add-word-to-word", { addedWord }).then((res) => {
        setSnackbar(true);
    });
  };

  const handleChange = (event) => {
    setWord(event.target.value);
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
          marginTop: "50px",
        }}
      >
        Kelime Ekle
      </Button>
      <CustomDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Kelime Ekle</DialogTitle>
        <DialogContent>
          <RadioButton props={(value) => setRadio(value)} />
          <Input type="text" onChange={handleChange} label="Yaz" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            İptal
          </Button>
          <Button onClick={handleSubmit} color="secondary">
            Ekle Gitsin
          </Button>
        </DialogActions>
      </CustomDialog>
      <Snackbar
  snackbar={snackbar}
  setSnackbar={(bool) => {
    setSnackbar(bool);
  }}
/>

    </div>
  );
}

export default FormDialog;
