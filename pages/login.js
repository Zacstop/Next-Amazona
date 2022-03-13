import {
  Button,
  Link,
  List,
  ListItem,
  TextField,
  Typography,
} from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import NextLink from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';
import Cookies from 'js-cookie';
import { useSnackbar } from 'notistack';
import { Controller, useForm } from 'react-hook-form';

export default function Login() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const router = useRouter();
  const { redirect } = router.query; // login?redirect=/shipping
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  useEffect(() => {
    if (userInfo) {
      router.push('/');
    }
  }, []);
  const classes = useStyles();
  const loginHandler = async ({ email, password }) => {
    closeSnackbar();
    try {
      const { data } = await axios.post('/api/users/login', {
        email,
        password,
      });
      dispatch({ type: 'USER_LOGIN', payload: data });
      Cookies.set('userInfo', data);
      router.push(redirect || '/');
    } catch (err) {
      enqueueSnackbar(
        err.response.data ? err.response.data.message : err.message,
        { variant: 'error' }
      );
    }
  };

  return (
    <Layout title="Login">
      <form onSubmit={handleSubmit(loginHandler)} className={classes.form}>
        <Typography variant="h1">Login</Typography>
        <List>
          <ListItem>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                pattern: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="email"
                  label="Email"
                  inputProps={{ type: 'email' }}
                  error={Boolean(errors.email)}
                  helperText={
                    errors.email
                      ? errors.email.type === 'pattern'
                        ? 'Email is not valid'
                        : 'Email is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: true,
                minLength: 6,
              }}
              render={({ field }) => (
                <TextField
                  variant="outlined"
                  fullWidth
                  id="password"
                  label="Password"
                  inputProps={{ type: 'password' }}
                  error={Boolean(errors.password)}
                  helperText={
                    errors.password
                      ? errors.password.type === 'minLength'
                        ? 'password length is more than 5'
                        : 'Email is required'
                      : ''
                  }
                  {...field}
                ></TextField>
              )}
            ></Controller>
          </ListItem>
          <ListItem>
            <Button color="primary" variant="contained" type="submit" fullWidth>
              LOGIN
            </Button>
          </ListItem>
          <ListItem>
            Do not have an account? &nbsp;
            <NextLink href={`/register?redirect=${redirect || '/'}`} passHref>
              <Link>
                <Typography color="primary">Register</Typography>
              </Link>
            </NextLink>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
