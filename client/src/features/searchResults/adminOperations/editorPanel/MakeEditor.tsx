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

function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    axios.patch("/api/makeEditor", { email: email }).then((res) => {});
  };

  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  };

  return (
    <div>
      <Button variant="contained" size="small" onClick={handleClickOpen}>
        Editör Ata
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="form-dialog-title">Editör Ata</DialogTitle>
        <DialogContent>
          <TextField type="email" onChange={handleEmailChange} label="Email" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>İptal</Button>
          <Button onClick={handleSubmit}>Editör Ata</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FormDialog;
