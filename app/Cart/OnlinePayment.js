import React, { useEffect, useState } from "react";
import Loading from "../loading";

const OnlinePayment = ({ order }) => {
  const [paymentToken, setPaymentToken] = useState("");
  const [loading, setLoading] = useState(true);
  console.log(loading);
  useEffect(() => {
    setLoading(true);
    const firstStep = async () => {
      let data = {
        api_key: process.env.NEXT_PUBLIC_PAYMENT_API_KEY,
      };
      let request = await fetch("https://accept.paymob.com/api/auth/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      let response = await request.json();
      let token = response.token;
      return token;
    };
    const secondStep = async (token) => {
      let data = {
        ...order,
        auth_token: token,
        delivery_needed: "false",
        currency: "EGP",
      };
      let request = await fetch(
        "https://accept.paymob.com/api/ecommerce/orders",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      let response = await request.json();
      let id = response.id;
      return id;
    };
    const thirdStep = async (id, auth_token) => {
      let data = {
        auth_token: auth_token,
        amount_cents: order.amount_cents,
        expiration: 3600,
        order_id: id,
        billing_data: {
          apartment: "NA",
          email: "NA",
          floor: "NA",
          first_name: "NA",
          street: "NA",
          building: "NA",
          phone_number: "NA",
          shipping_method: "NA",
          postal_code: "NA",
          city: "NA",
          country: "NA",
          last_name: "NA",
          state: "NA",
        },
        currency: "EGP",
        integration_id: 4435924,
      };
      let request = await fetch(
        "https://accept.paymob.com/api/acceptance/payment_keys",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      let response = await request.json();
      setPaymentToken(response.token);
    };
    const Payment = async () => {
      const auth_token = await firstStep();
      const id = await secondStep(auth_token);
      await thirdStep(id, auth_token);
      setLoading(false);
    };
    Payment();
  }, []);
  useEffect(() => {
    if (paymentToken) {
      let iframeURL = `https://accept.paymob.com/api/acceptance/iframes/815458?payment_token=${paymentToken}`;
      location.href = iframeURL;
    }
  }, [paymentToken]);
  return (
    loading && (
      <div className="overlay">
        <img src="/loading-13.gif"></img>
      </div>
    )
  );
};

export default OnlinePayment;
