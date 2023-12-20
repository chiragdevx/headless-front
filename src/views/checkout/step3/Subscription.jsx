import React, { useEffect, useState } from 'react'
import { Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { apiOmsHelper } from '@/helpers/api';
import { useSelector } from "react-redux";
import { useFormikContext } from 'formik';

const subscriptionModelData = [
  { id: 1, title: 'Basic Plan', price: '$9.99/month', features: ['Feature 1', 'Feature 2', 'Feature 3'] },
  { id: 2, title: 'Standard Plan', price: '$19.99/month', features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'] },
  { id: 3, title: 'Premium Plan', price: '$29.99/month', features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5'] },
];


const Subscription = ({shipping}) => {
  const { values, setValues } = useFormikContext();
  const [plansData, setPlansData] = useState([]);
  
  const { basket } = useSelector((state) => ({
    basket: state.basket,
  }));

  const getProductIds = (basket) =>
    basket.map(({ id, variantId, quantity }) => ({
      productId: id,
      variantId,
      quantity,
    }));

  useEffect(async() => {
    const {data} = await apiOmsHelper("plans", "GET");
    console.log('data', data);
    setPlansData(data);
  }, [])

  const handleSubscribe = async (e) => {
    const productIds = getProductIds(basket);
    console.log('productIds', productIds)
    const payload = {
      userId: "39311b9b-cc61-4986-9dc8-6272e6fbfb54",
      productIds,
      billingAddress: {
        country: "USA",
        city: "Surat",
        postalCode: "3000",
        state: shipping.address,
        area: "Citylight",
      },
      shippingAddress: {
        country: "AU",
        city: "Surat",
        postalCode: "3000",
        state: shipping.address,
        area: shipping.address,
      },
      priceCurrency: "usd",
      type: "SUBSCRIPTION",
      paymentMethod: "ONLINE",
      paymentType:  values?.type.toUpperCase(),
    };
    try {
      const { data: order } = await apiOmsHelper(
        "order/one-time",
        "POST",
        payload
      );

      console.log("order :>> ", order.sessionUrl);
      window.location.href = order.sessionUrl;
    } catch (e) {
      console.log("e :>> ", e);
    }
    //  displayActionMessage('Feature not ready yet :)', 'info');
  }

  return (
    <Grid container mt="3px" spacing={3}>
      {plansData.map((plan, index)=> (
        <Grid item key={plan.id} xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {`Plan ${index + 1}`}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                ${plan.fixedPrice}
              </Typography>
              <ul>
                <li>Interval : {plan.interval}</li>
                <li>Minimum Products : {plan.minimumProducts}</li>
                <li>{plan.description}</li>
              </ul>
              <Button variant="contained" color="primary" onClick={handleSubscribe}>
                Subscribe
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default Subscription;
