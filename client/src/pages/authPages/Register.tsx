import React, { useState } from "react";
import axios from "axios";
import { Button, Card, CardContent, Stack, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

function Login() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    password: "",
    code: "",
    name: "",
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log(user);

    axios
      .post("/api/register", user)
      .then((res) => {
        enqueueSnackbar("Kayıt başarılı.", { variant: "success" });
        navigate("/");
      })
      .catch((error) => {
        switch (error.response.status) {
          case 401:
            enqueueSnackbar("Kayıt başarısız.", { variant: "error" });
            break;
          case 409:
            enqueueSnackbar("Zaten kayıtlı.", { variant: "error" });
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

  const handleSecretChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, code: event.target.value });
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, name: event.target.value });
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <h1>Register.</h1>
            <TextField
              type="text"
              onChange={handleNameChange}
              label="Full Name"
              required
            />
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
            <TextField
              type="text"
              onChange={handleSecretChange}
              label="Secret"
              required
            />

            <Button variant="contained" size="large" type="submit">
              Register
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}

export default Login;
