import React, { useEffect, useState } from "react";
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
} from "../../../../slices/wordSlice";
import SortableContainer from "../../../../components/SortableContainer";
import { TabObject } from "../../../../global/types";

function FormDialog() {
  const dispatch = useAppDispatch();
  const wordResult = useAppSelector(selectWordResults);
  const [open, setOpen] = React.useState(false);
  const [tabs, setTabs] = useState<TabObject[]>([]);
  const [tabIDs, setTabIDs] = useState<string[]>([]);

  useEffect(() => {
    setTabs(wordResult.tabs);
  }, [wordResult.tabs]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    axios
      .patch("/api/word", {
        wordUpdate: { tabs: tabIDs },
        wordID: wordResult.wordID,
      })
      .then((res) => {
        dispatch(triggerChangeFlag());
      });
  };

  if (!wordResult.created) return null;

  return (
    <div>
      <Button variant="text" size="small" onClick={handleClickOpen}>
        Sekme Sırası Değiştir
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Sekme Sırası Değiştir</DialogTitle>
        <DialogContent>
          <SortableContainer
            items={tabs.map((tab) => {
              return tab.name;
            })}
            ids={tabs.map((tab) => {
              return tab._id;
            })}
            onChange={(items) => setTabIDs(items)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>İptal</Button>
          <Button type="submit" onClick={handleSubmit}>
            Değiştir
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FormDialog;
