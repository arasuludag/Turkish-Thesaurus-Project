import { Card, CardContent, Stack, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchWord,
  selectChangeFlag,
  selectWordResults,
} from "../search/wordSlice";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import Tabs from "./Tabs";
import AddWord from "./adminOperations/AddWord";
import { fetchUser } from "../pages/authPages/userSlice";
import EditorPanel from "./adminOperations/editorPanel/EditorPanel";
import ShowSampleUsage from "./ShowSampleUsage";

function SearchResult() {
  const dispatch = useAppDispatch();
  const searchResult = useAppSelector(selectWordResults);
  const triggerChangeFlag = useAppSelector(selectChangeFlag);
  let { word } = useParams();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (word) dispatch(fetchWord(word));
    document.title = word || "TResaurus";
  }, [dispatch, word, triggerChangeFlag]);

  function checkData() {
    if (!searchResult.word) return null;
    else if (!searchResult.created)
      return (
        <Card>
          <CardContent>
            <Typography gutterBottom>
              {word} diye bir şey şimdilik yok. Olması gerekiyorsa yakında
              eklenecektir.
            </Typography>
            <AddWord />
          </CardContent>
        </Card>
      );
    else
      return (
        <div>
          <Card>
            <CardContent>
              <Typography
                variant="h3"
                sx={{ textAlign: "center" }}
                gutterBottom
              >
                {searchResult.word}
              </Typography>
              <Tabs searchResult={searchResult} />
            </CardContent>
          </Card>
        </div>
      );
  }

  return (
    <Stack spacing={2} sx={{ width: "100%", maxWidth: "800px" }}>
      {checkData()} <EditorPanel /> <ShowSampleUsage />
    </Stack>
  );
}

export default SearchResult;
