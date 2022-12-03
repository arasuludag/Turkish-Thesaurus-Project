import { useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  selectWordResults,
  triggerChangeFlag,
} from "../../../search/wordSlice";
import ToggleButtons from "../../../components/ToggleButtons";

function FormDialog() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const searchResult = useAppSelector(selectWordResults);
  const [tabID, setTabID] = useState<string | null>(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (tabID)
      axios.delete(`/api/tab/${tabID}`).then((res) => {
        dispatch(triggerChangeFlag());
      });
  };

  return (
    <div>
      <Button variant="contained" size="small" onClick={handleClickOpen}>
        Sekme Sil
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Sekme Sil</DialogTitle>
        <DialogContent>
          <ToggleButtons
            options={searchResult.tabs.map((tab) => {
              return { name: tab.name, id: tab._id };
            })}
            onChange={(option) => setTabID(option || null)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>İptal</Button>
          <Button onClick={handleSubmit}>Sil Gitsin</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FormDialog;
