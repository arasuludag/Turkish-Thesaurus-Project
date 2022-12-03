import { CssBaseline, Stack } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./features/pages/authPages/Login";
import Register from "./features/pages/authPages/Register";
import Search from "./features/search/Search";
import SearchResults from "./features/searchResults/SearchResults";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FFFFFF",
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <SnackbarProvider>
        <CssBaseline />
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
          sx={{ marginX: 1 }}
        >
          <Search />

          <Routes>
            <Route path="/" />
            <Route path="/ara/:word" element={<SearchResults />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
          </Routes>
        </Stack>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
