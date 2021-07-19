import React, { useState } from "react";
import axios from "axios";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";

import Input from "./Input.jsx";
import Snackbar from "./Snackbar.jsx";

const CustomDialog = withStyles({
  paper: {
    backgroundColor: "#1c1d26",
  },
})(Dialog);

function FormDialog(props) {

  const [open, setOpen] = React.useState(false);
  const [snackbar, setSnackbar] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post("/api/make-editor", { email: email }).then((res) => {
        setSnackbar(true);
    });
  };

  const handleChange = (event) => {
    setEmail(event.target.value);
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
        Editör Ata
      </Button>
      <CustomDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Editör Ata</DialogTitle>
        <DialogContent>
          <p>Bu konuda dikkat!</p>
          <Input type="text" onChange={handleChange} label="E-Mail" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            İptal
          </Button>
          <Button onClick={handleSubmit} color="secondary">
            Editör Yap
          </Button>
        </DialogActions>
      </CustomDialog>
      <Snackbar snackbar = {snackbar} setSnackbar={(bool) => {setSnackbar(bool);}}/>
    </div>
  );
}

export default FormDialog;
