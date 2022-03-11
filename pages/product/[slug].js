import {
  Button,
  Card,
  Grid,
  Link,
  List,
  ListItem,
  Typography,
} from '@material-ui/core';
import Image from 'next/image';
import React, { useContext } from 'react';
import Layout from '../../components/Layout';
import NextLink from 'next/link';
import useStyles from '../../utils/styles';
import db from '../../utils/db';
import Product from '../../models/Product';
import { Store } from '../../utils/Store';
import axios from 'axios';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

function ProductScreen(props) {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { product } = props;
  const classes = useStyles();
  if (!product) {
    return <div>Product Not Found</div>;
  }
  const existItem = state.cart.cartItems.find((x) => x._id === product._id);
  const quantity = existItem ? existItem.quantity + 1 : 1;
  const addCartHandler = async () => {
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock <= quantity) {
      window.alert('No more stock');
      return;
    }
    console.log({ ...product });
    dispatch({ type: 'ADD_TO_CART', payload: { ...product, quantity } });
    router.push('/cart');
  };

  return (
    <Layout title={product.name}>
      <div className={classes.section}>
        <NextLink href={'/'} passHref>
          <Link>
            <Typography>back to product</Typography>
          </Link>
        </NextLink>
      </div>
      <Grid container spacing={1}>
        <Grid item md={6}>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          />
        </Grid>
        <Grid item md={3}>
          <List>
            <ListItem>
              <Typography>{product.name}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Category: {product.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Brand: {product.brand}</Typography>
            </ListItem>
            <ListItem>
              <Typography>
                Rating: {product.rating} stars ({product.countInStock} reviews)
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Description: {product.description}</Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3}>
          <Card>
            <List>
              <Grid container>
                <ListItem>
                  <Grid item md={6}>
                    <Typography>Price:</Typography>
                  </Grid>
                  <Grid item md={6}>
                    $ {product.price}
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid item md={6}>
                    <Typography>Status:</Typography>
                  </Grid>
                  <Grid item md={6}>
                    <Typography>
                      {product.countInStock > 0 ? 'In Stock' : 'No Stock'}
                    </Typography>
                  </Grid>
                </ListItem>
              </Grid>
              <ListItem>
                <NextLink href={'/cart'} passHref>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={addCartHandler}
                  >
                    ADD TO CART
                  </Button>
                </NextLink>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
}

export default dynamic(() => Promise.resolve(ProductScreen), { ssr: false });
