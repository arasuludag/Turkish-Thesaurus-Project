import { Box, CssBaseline, Stack } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/authPages/Login";
import Register from "./pages/authPages/Register";
import Footer from "./pages/footer/Footer";
import SearchResults from "./pages/searchResults/SearchResults";
import AppBar from "./pages/appBar/AppBar";
import { useAppSelector } from "./app/hooks";
import { selectTheme } from "./slices/userSlice";

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

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#FFBF00",
    },
    background: {
      default: "#E9EAEC",
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
});

function App() {
  const theme = useAppSelector(selectTheme);

  return (
    <ThemeProvider theme={theme ? darkTheme : lightTheme}>
      <SnackbarProvider>
        <CssBaseline />
        <AppBar />
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
          sx={{ margin: 2 }}
        >
          <Routes>
            <Route path="/" element={<Box sx={{ minHeight: "85vh" }}></Box>} />
            <Route path="/ara/:word" element={<SearchResults />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
          </Routes>

          <Footer />
        </Stack>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
