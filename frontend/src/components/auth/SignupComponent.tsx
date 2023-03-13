import { Button, Grid, TextField } from "@mui/material";
import axios from "axios";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import FormController from "../utils/FormController";

type SignupData = {
  username: string;
  email: string;
  password: string;
}

function SignupComponent() {
  const { control, handleSubmit, reset } = useForm<SignupData>({ defaultValues: { username: '', email: '', password: '' } });

  const onSubmit: SubmitHandler<SignupData> = async (data) => {
    try {
      const res = await axios.post('http://localhost:8080/auth/signup', {
        name: data.username,
        email: data.email,
        password: data.password,
      });
      console.log(res.data);
      reset();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Grid>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>Signup Component</h2>
        <FormController
          name="username"
          control={control}
          RenderComponent={(field: any) => (
            <TextField {...field} label={'username'} placeholder={'username'}/>
          )}
        />
        <FormController
          name="email"
          control={control}
          RenderComponent={(field: any) => (
            <TextField {...field} label={'email'} placeholder={'email'}/>
          )}
        />
        <FormController
          name="password"
          control={control}
          RenderComponent={(field: any) => (
            <TextField {...field} label={'password'} placeholder={'password'}/>
          )}
        />
        <Button type="submit" variant="contained">SIGNUP</Button>
      </form>
    </Grid>
  )
}

export default SignupComponent;
