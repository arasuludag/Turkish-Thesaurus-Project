import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  selectCurrentTab,
  triggerChangeFlag,
} from "../../../../slices/wordSlice";
import SortableContainer from "../../../../components/SortableContainer";
import { TabObject } from "../../../../global/types";

function FormDialog() {
  const dispatch = useAppDispatch();
  const currentTab = useAppSelector(selectCurrentTab);
  const [open, setOpen] = React.useState(false);
  const [words, setWords] = useState<Partial<TabObject>>({
    thesaurus: [],
    similar: [],
    antonymous: [],
  });

  useEffect(() => {
    setWords({
      thesaurus: currentTab?.thesaurus || [],
      similar: currentTab?.similar || [],
      antonymous: currentTab?.antonymous || [],
    });
  }, [currentTab?.antonymous, currentTab?.similar, currentTab?.thesaurus]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    axios
      .patch("/api/tab", {
        newTab: words,
        tabID: currentTab._id,
      })
      .then((res) => {
        dispatch(triggerChangeFlag());
      });
  };

  const handleChange = (
    items: Partial<{
      thesaurus: string[];
      similar: string[];
      antonymous: string[];
    }>
  ) => {
    setWords({ ...words, ...items });
  };

  if (!currentTab) return null;

  return (
    <div>
      <Button variant="text" size="small" onClick={handleClickOpen}>
        Kelime Sırası Değiştir
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Kelime Sırası Değiştir</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <SortableContainer
              items={words.thesaurus || []}
              onChange={(items) => handleChange({ thesaurus: items })}
              color="#7BC17E"
            />
            <SortableContainer
              items={words.similar || []}
              onChange={(items) => handleChange({ similar: items })}
              color="#D0C212"
            />
            <SortableContainer
              items={words.antonymous || []}
              onChange={(items) => handleChange({ antonymous: items })}
              color="#C93030"
            />
          </Stack>
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
