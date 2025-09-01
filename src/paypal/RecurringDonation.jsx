import React, { useState } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

export const RecurringDonation = ({paymentSessionId}) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const [message, setMessage] = useState("");

  return (
    <div>
      <h2>Recurring donation</h2>
      {isPending && <div>Loading PayPal...</div>}
      <PayPalButtons
        style={{ layout: "vertical" }}
        createSubscription={async () => {

          console.log("paymtnsssionid", paymentSessionId )
          if(!paymentSessionId) {
            alert("ps id not found")
          }
          const resp = await fetch(
            "http://localhost:8080/api/v1/payment/checkout",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                donationId: paymentSessionId, 
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
        onApprove={(data) => {
          setMessage("Subscription active! ID: " + data.subscriptionID);
        }}
        onError={(err) => {
          console.error("Subscription error", err);
          setMessage("Subscription failed: " + (err?.message || "unknown"));
        }}
      />
      {message && <div className="mt-2">{message}</div>}
    </div>
  );
};
