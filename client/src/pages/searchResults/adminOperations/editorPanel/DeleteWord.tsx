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
  selectCurrentTab,
  triggerChangeFlag,
} from "../../../../slices/wordSlice";
import ToggleButtons from "../../../../components/ToggleButtons";

function FormDialog() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const currentTab = useAppSelector(selectCurrentTab);
  const [toggleButtonValue, setToggleButtonValue] = useState<string | null>(
    null
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (toggleButtonValue)
      axios
        .delete(`/api/wordFromTab/${currentTab._id}/${toggleButtonValue}`)
        .then((res) => {
          dispatch(triggerChangeFlag());
        });
  };

  if (!currentTab) return null;

  return (
    <div>
      <Button variant="text" size="small" onClick={handleClickOpen}>
        Kelime Sil
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Kelime Sil</DialogTitle>
        <DialogContent>
          <ToggleButtons
            options={
              currentTab?.thesaurus
                .concat(currentTab?.similar)
                .concat(currentTab?.antonymous)
                .map((word) => {
                  return { name: word };
                }) || []
            }
            onChange={(option) => setToggleButtonValue(option || null)}
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
