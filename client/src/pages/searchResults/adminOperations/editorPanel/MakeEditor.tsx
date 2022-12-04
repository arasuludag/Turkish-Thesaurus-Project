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
import { useSnackbar } from "notistack";

function FormDialog() {
  const { enqueueSnackbar } = useSnackbar();
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

    axios
      .patch("/api/makeEditor", { email: email })
      .then((res) => {
        enqueueSnackbar(`${email} editör yapıldı.`, { variant: "success" });
      })
      .catch((error) => {
        if (error.response.status === 404)
          enqueueSnackbar(`${email} diye biri yok.`, { variant: "error" });
      });
  };

  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  };

  return (
    <div>
      <Button variant="text" size="small" onClick={handleClickOpen}>
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
