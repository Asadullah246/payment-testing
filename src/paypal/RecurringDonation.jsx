import React, { useState } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

export const RecurringDonation = () => {
  const [{ isPending }] = usePayPalScriptReducer();
  const [message, setMessage] = useState("");

  return (
    <div>
      <h2>Recurring donation</h2>
      {isPending && <div>Loading PayPal...</div>}
      <PayPalButtons
        style={{ layout: "vertical" }}
        createSubscription={async () => {
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
          const data = await resp.json();
          console.log("data", data);
          if (!data?.data?.recurringRes?.id) {
            throw new Error("Failed to create subscription");
          }
          return data?.data?.recurringRes?.id;
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
