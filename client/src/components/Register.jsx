import React, { useState } from "react";
import axios from "axios";

import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

import Input from "./Input.jsx";


function Register() {


  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const user = {
      name: name,
      username: userName,
      password: password,
      code: code
    };

    axios.post("/api/register", { user }).then((res) => {
      window.location = "/";
    });
  };

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  const handlePassChange = (event) => {
    setPassword(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  return (
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
      >

      <Grid item xs={12} sm={8} lg={3}>
        <Paper elevation={4} className="smoothbackground">
          <form onSubmit={handleSubmit}>
            <h1>Register.</h1>
            <div className="row">

              <Input
                type="text"
                onChange={handleNameChange}
                label="Name" />

                <Input
                  type="email"
                  onChange={handleUserNameChange}
                  label="Email" />

                  <Input
                    type="password"
                    onChange={handlePassChange}
                    label="Password" />

                    <Input
                      type="text"
                      onChange={handleCodeChange}
                      label="Registration Code" />


                  <Button variant="contained" size="large" type="submit" style={{
                    marginLeft: "10px",
                    backgroundColor: "#D9CB9E",
                    color: "white",
                    borderRadius: "10px",
                  }}>
                Register
              </Button>
            </div>
          </form>
        </Paper>
        </Grid>
      </Grid>
  );
}

export default Register;
