import { CHECKOUT_STEP_1 } from "@/constants/routes";
import { Form, Formik, useFormikContext } from "formik";
import { displayActionMessage } from "@/helpers/utils";
import { useDocumentTitle, useScrollTop } from "@/hooks";
import PropType from "prop-types";
import React from "react";
import { Redirect } from "react-router-dom";
import * as Yup from "yup";
import { StepTracker } from "../components";
import withCheckout from "../hoc/withCheckout";
import CreditPayment from "./CreditPayment";
import PayPalPayment from "./PayPalPayment";
import Subscription from "./Subscription";
import Total from "./Total";
import StripePayment from "./StripePayment";
import { useSelector } from "react-redux";
import { apiOmsHelper } from "@/helpers/api";

const FormSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, "Name should be at least 4 characters.")
    .required("Name is required"),
  cardnumber: Yup.string()
    .min(13, "Card number should be 13-19 digits long")
    .max(19, "Card number should only be 13-19 digits long")
    .required("Card number is required."),
  expiry: Yup.date().required("Credit card expiry is required."),
  ccv: Yup.string()
    .min(3, "CCV length should be 3-4 digit")
    .max(4, "CCV length should only be 3-4 digit")
    .required("CCV is required."),
  type: Yup.string().required("Please select paymend mode"),
});

const Payment = ({ shipping, payment, subtotal }) => {
  console.log("shipping,payment,subtotal :>> ", shipping, payment, subtotal);

  useDocumentTitle("Check Out Final Step ");
  useScrollTop();

  const { basket } = useSelector((state) => ({
    basket: state.basket,
  }));
  const initFormikValues = {
    name: payment.name || "",
    cardnumber: payment.cardnumber || "",
    expiry: payment.expiry || "",
    ccv: payment.ccv || "",
    type: payment.type || "paypal",
  };

  const getProductIds = (basket) =>
    basket.map(({ id, variantId, quantity }) => ({
      productId: id,
      variantId,
      quantity,
    }));

  const onConfirm = async (e) => {
    const productIds = getProductIds(basket);
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
      type: "ONE_TIME",
      paymentMethod: "ONLINE",
      paymentType: e?.type.toUpperCase(),
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
  };

  if (!shipping || !shipping.isDone) {
    return <Redirect to={CHECKOUT_STEP_1} />;
  }
  return (
    <div className="checkout">
      <StepTracker current={3} />
      <Formik initialValues={initFormikValues} onSubmit={onConfirm}>
        {() => (
          <Form className="checkout-step-3">
            {/* <CreditPayment /> */}
            <PayPalPayment />
            <StripePayment />
            <Subscription shipping={shipping}/>
            <Total
              isInternational={shipping.isInternational}
              subtotal={subtotal}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

Payment.propTypes = {
  shipping: PropType.shape({
    isDone: PropType.bool,
    isInternational: PropType.bool,
  }).isRequired,
  payment: PropType.shape({
    name: PropType.string,
    cardnumber: PropType.string,
    expiry: PropType.string,
    ccv: PropType.string,
    type: PropType.string,
  }).isRequired,
  subtotal: PropType.number.isRequired,
};

export default withCheckout(Payment);
