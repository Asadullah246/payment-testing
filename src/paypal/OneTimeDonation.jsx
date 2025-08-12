import React, { useState } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

export const OneTimeDonation = ({ amount, currency = "GBP" }) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const [message, setMessage] = useState("");

  return (
    <div className="mb-8">
      <h2>One-time donation:</h2>
      {isPending && <div>Loading PayPal...</div>}
      <PayPalButtons
        style={{ layout: "vertical" }}
        forceReRender={[amount, currency]}
        createOrder={async (_, actions) => {
          // create order on your backend
          const resp = await fetch(
            "http://localhost:8080/api/v1/payment/checkout",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
        paymentSessionId: "id here",
        paymentGateway: "Paypal",       
      }),
            }
          );

          const response = await resp.json();
          const data = response.data;
          console.log("data", data);
          const id = data?.singleRes?.id;
          console.log("id", id);
          if (!id) {
            throw new Error("Failed to create order");
          }
          return id;
        }}
        onApprove={async (_, actions) => {
          console.log("others", _);
          console.log("acton", actions);
          // capture order via backend
          console.log("order id ", await actions.order?.get());
          const actionData = await actions.order?.get();
          const orderId = actionData.id ?? _.orderID;
          if (orderId) {
            const resp = await fetch(
              "http://localhost:8080/api/v1/payment/finalize-payment",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                  paypalOrderId: (await actions.order?.get())?.id || undefined,
                  paymentGateway: "Paypal",
                }),
              }
            );
            const result = await resp.json();
            console.log("result in approve", result);
            setMessage(
              "Success! Transaction ID: " +
                (result.captureId || JSON.stringify(result))
            );
          }
          else{
            alert("order id not found")
          }
        }}
        onError={(err) => {
          console.error("One-time PayPal error", err);
          setMessage("Payment failed: " + (err?.message || "unknown"));
        }}
      />
      {message && <div className="mt-2">{message}</div>}
    </div>
  );
};
