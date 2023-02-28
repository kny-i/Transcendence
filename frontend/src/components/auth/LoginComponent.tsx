import { Button, Grid } from "@mui/material";
import axios from "axios";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
import FormController from "../utils/FormController";

type LoginData = {
  email: string;
  password: string;
}

function LoginComponent() {
  // const router = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const { control, handleSubmit, reset } = useForm<LoginData>({ defaultValues: { email: '', password: '' } });

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    try {
      const loginRes = await axios.post('http://localhost:8080/auth/login', {
        email: data.email,
        password: data.password,
      });
      console.log(loginRes.data);
      const user = await axios.get('http://localhost:8080/user');
      console.log(user.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Grid>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Login Component</h2>
        <FormController
          name="email"
          placeholder="type email"
          control={control}
        />
        <FormController
          name="password"
          placeholder="type password"
          control={control}
        />
        <Button type="submit" variant="contained">Login</Button>
      </form>
    </Grid>
  )
}

export default LoginComponent;
