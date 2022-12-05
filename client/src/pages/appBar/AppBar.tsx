import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Search from "./search/Search";
import ThemeSelection from "./ThemeSelection";

export default function SearchAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" color="default">
        <Toolbar sx={{ height: "75px", padding: 0 }}>
          <ThemeSelection />
          <Box sx={{ maxWidth: "600px", width: "100%", margin: "0 auto" }}>
            <Search />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
