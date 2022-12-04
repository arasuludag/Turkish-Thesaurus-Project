import { Card, CardContent, Stack } from "@mui/material";
import { useAppSelector } from "../../../../app/hooks";
import { selectCurrentUser } from "../../../../slices/userSlice";
import AddTab from "./AddTab";
import AddWordToWord from "./AddWordToWord";
import DeleteTab from "./DeleteTab";
import DeleteWord from "./DeleteWord";
import MakeEditor from "./MakeEditor";

function EditorPanel() {
  const currentUser = useAppSelector(selectCurrentUser);

  if (currentUser === "" || !currentUser?.isEditor) return null;
  else
    return (
      <Card>
        <CardContent>
          <Stack direction="row" spacing={1}>
            <AddWordToWord />
            <AddTab />
            <DeleteWord />
            <DeleteTab />
            <MakeEditor />
          </Stack>
        </CardContent>
      </Card>
    );
}

export default EditorPanel;
