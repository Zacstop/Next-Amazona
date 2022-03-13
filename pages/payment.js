import {
  Button,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import useStyles from '../utils/styles';
import { useRouter } from 'next/router';
import { Store } from '../utils/Store';
import Cookies from 'js-cookie';
import CheckoutWizard from '../components/checkoutWizard';
import { useSnackbar } from 'notistack';

export default function Shipping() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [paymentMethod, setPaymentMethod] = useState('');
  const router = useRouter();
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { shippingAddress },
  } = state;
  useEffect(() => {
    if (!shippingAddress) {
      router.push('/shipping');
    } else {
      setPaymentMethod(Cookies.get('paymentMethod') || '');
    }
  }, []);
  const paymentHandler = async (e) => {
    closeSnackbar();
    e.preventDefault();
    if (!paymentMethod) {
      enqueueSnackbar('Payment method is required', { variant: 'error' });
    } else {
      dispatch({ type: 'SAVE_PAYMENT_METHOD', payload: paymentMethod });
      Cookies.set('paymentMethod', paymentMethod);
      router.push('/placeorder');
    }
  };

  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2} />
      <form onSubmit={paymentHandler} className={classes.form}>
        <Typography component="h1" variant="h1">
          Payment Method
        </Typography>
        <List>
          <ListItem>
            <FormControl component="fieldset">
              <RadioGroup
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  label="PayPal"
                  value="PayPal"
                  control={<Radio />}
                />
                <FormControlLabel
                  label="Stripe"
                  value="Stripe"
                  control={<Radio />}
                />
                <FormControlLabel
                  label="Cash"
                  value="Cash"
                  control={<Radio />}
                />
              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem>
            <Button color="primary" variant="contained" type="submit" fullWidth>
              Continue
            </Button>
          </ListItem>
          <ListItem>
            <Button
              variant="contained"
              fullWidth
              onClick={() => router.push('/shipping')}
            >
              Back
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
}
