import {
  Button,
  Card,
  Grid,
  Link,
  List,
  ListItem,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import React, { useContext } from 'react';
import Layout from '../components/Layout';
import { Store } from '../utils/Store';
import Image from 'next/image';
import NextLink from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function CartScreen() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCountHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'ADD_TO_CART', payload: { ...item, quantity } });
  };
  const removeItemHandler = (item) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };
  const checkoutHandler = () => {
    router.push('/shipping');
  };

  return (
    <Layout title="Cart">
      <Typography component="h1" variant="h1">
        Shopping Cart
      </Typography>
      <Grid container>
        <Grid item md={9}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={50}
                        height={50}
                      />
                    </TableCell>
                    <TableCell>
                      <NextLink href={`/product/${item.slug}`} passHref>
                        <Link>
                          <Typography color="primary">{item.name}</Typography>
                        </Link>
                      </NextLink>
                    </TableCell>
                    <TableCell align="right">
                      <Select
                        value={item.quantity}
                        onChange={(e) =>
                          updateCountHandler(item, e.target.value)
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <MenuItem key={x + 1} value={x + 1}>
                            {x + 1}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell align="right">
                      <Typography>$ {item.price}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => removeItemHandler(item)}
                      >
                        x
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item md={3}>
          <Card>
            <List>
              <ListItem>
                <Typography variant="h2">
                  Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                  items): $
                  {cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                </Typography>
              </ListItem>
              <ListItem>
                <Button
                  color="primary"
                  variant="contained"
                  fullWidth
                  onClick={checkoutHandler}
                >
                  CHECK OUT
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}
