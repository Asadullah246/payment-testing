import React, { useState } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

export const OneTimeDonation = ({ paymentSessionId }) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const [message, setMessage] = useState("");

  return (
    <div className="mb-8">
      <h2>One-time donation:</h2>
      {isPending && <div>Loading PayPal...</div>}
      <PayPalButtons
        style={{ layout: "vertical" }}
        // forceReRender={[amount, currency]}
        createOrder={async (_, actions) => {
          // create order on your backend

          if (!paymentSessionId) {
            alert("ps id not found");
          }
          const resp = await fetch(
            "http://localhost:8080/api/v1/payment/checkout",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                paymentSessionId: paymentSessionId,
                paymentGateway: "Paypal",
              }),
            }
          );

          const response = await resp.json();
          const data = response.data;
          console.log("data", data);
          const id = data?.id;
          console.log("id", id);
          if (!id) {
            alert( "id not found")
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
          } else {
            alert("order id not found");
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
