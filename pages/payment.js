import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import { Store } from '../utils/Store';

export default function Payment() {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  useEffect(() => {
    if (!shippingAddress.address) {
      router.push('/shipping');
    } else {
      setPaymentMethod(Cookies.get('paymentMethod') || '');
    }
  }, []);
  return <div>payment</div>;
}
