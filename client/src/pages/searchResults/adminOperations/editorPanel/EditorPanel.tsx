import { Card, CardContent, Grid } from "@mui/material";
import { useAppSelector } from "../../../../app/hooks";
import { selectCurrentUser } from "../../../../slices/userSlice";
import AddTab from "./AddTab";
import AddWordToWord from "./AddWordToWord";
import ChangeTabOrder from "./ChangeTabOrder";
import ChangeWordOrder from "./ChangeWordOrder";
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
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <AddWordToWord />
            <AddTab />
            <DeleteWord />
            <DeleteTab />
            <ChangeWordOrder />
            <ChangeTabOrder />
            <MakeEditor />
          </Grid>
        </CardContent>
      </Card>
    );
}

export default EditorPanel;
