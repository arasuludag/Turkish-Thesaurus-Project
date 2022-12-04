import React, { useState } from "react";
import axios from "axios";
import { Button, Card, CardContent, Stack, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

function Login() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", password: "" });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    axios
      .post("/api/login", user)
      .then((res) => {
        enqueueSnackbar("Girildi.", { variant: "success" });
        navigate("/");
      })
      .catch((error) => {
        switch (error.response.status) {
          case 401:
            enqueueSnackbar("Çeşitli yanlışlıklar.", { variant: "error" });
            break;
          default:
            break;
        }
      });
  };

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, username: event.target.value });
  };

  const handlePassChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, password: event.target.value });
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <h1>Login.</h1>
            <TextField
              type="email"
              onChange={handleUserNameChange}
              label="Email"
              required
            />

            <TextField
              type="password"
              onChange={handlePassChange}
              label="Password"
              required
            />

            <Button variant="contained" size="large" type="submit">
              Login
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}

export default Login;
