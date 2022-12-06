import { Card, CardContent, Skeleton, Stack, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchWord,
  selectChangeFlag,
  selectWordResults,
  userOnTab,
} from "../../slices/wordSlice";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import Tabs from "./Tabs";
import AddWord from "./adminOperations/AddWord";
import { fetchUser } from "../../slices/userSlice";
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

  // When new word arrives, set tab to initial one.
  useEffect(() => {
    dispatch(userOnTab({ index: 0 }));
  }, [dispatch, word]);

  function checkData() {
    if (!searchResult.word)
      return (
        <Card>
          <Skeleton width={120} height={100} sx={{ margin: "0 auto" }} />
          <Skeleton height={200} width={750} sx={{ margin: "0 auto" }} />
        </Card>
      );
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
