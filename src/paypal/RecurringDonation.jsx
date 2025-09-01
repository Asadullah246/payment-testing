import React, { useState } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

export const RecurringDonation = ({ paymentSessionId }) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const [message, setMessage] = useState("");

  return (
    <div>
      <h2>Recurring donation</h2>
      {isPending && <div>Loading PayPal...</div>}
      <PayPalButtons
        style={{ layout: "vertical" }}
        createSubscription={async () => {
          try {
            console.log("paymentSessionId", paymentSessionId);

            if (!paymentSessionId) {
              throw new Error("Payment session ID not found");
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
            console.log("response", response);
            // If backend returned non-200 status
            // if (!resp.ok) {
            //   const errorText = await resp.text();
            //   throw new Error(
            //     `Server responded with ${resp.status}: ${errorText}`
            //   );
            // }

            if (response.error) {
              throw new Error(response.error);
            }

            const id = response?.data?.id;
            if (!id) {
              throw new Error("No subscription ID returned from backend");
            }

            return id;
          } catch (err) {
            console.error("createSubscription error:", err);
            setMessage("Error: " + (err.message || "Something went wrong"));
            // rethrow to let PayPal SDK know subscription creation failed
            throw err;
          }
        }}
        onApprove={(data) => {
          setMessage("Subscription active! ID: " + data.subscriptionID);
        }}
        onError={(err) => {
          console.error("PayPal SDK error", err);
          setMessage(
            "Subscription failed: " + (err?.message || "Unknown error")
          );
        }}
      />
      {message && <div className="mt-2 text-red-600">{message}</div>}
    </div>
  );
};

// export const RecurringDonation = ({paymentSessionId}) => {
//   const [{ isPending }] = usePayPalScriptReducer();
//   const [message, setMessage] = useState("");

//   return (
//     <div>
//       <h2>Recurring donation</h2>
//       {isPending && <div>Loading PayPal...</div>}
//       <PayPalButtons
//         style={{ layout: "vertical" }}
//         createSubscription={async () => {

//           console.log("paymtnsssionid", paymentSessionId )
//           if(!paymentSessionId) {
//             alert("ps id not found")
//           }
//           const resp = await fetch(
//             "http://localhost:8080/api/v1/payment/checkout",
//             {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               credentials: "include",
//               body: JSON.stringify({
//                 donationId: paymentSessionId,
//                 paymentGateway: "Paypal",
//               }),
//             }
//           );

//           const response = await resp.json();
//           const data = response.data;
//           console.log("data", data);
//           const id = data?.id;
//           console.log("id", id);
//           if (!id) {
//             alert( "id not found")
//           }
//           return id;

//         }}
//         onApprove={(data) => {
//           setMessage("Subscription active! ID: " + data.subscriptionID);
//         }}
//         onError={(err) => {
//           console.error("Subscription error", err);
//           setMessage("Subscription failed: " + (err?.message || "unknown"));
//         }}
//       />
//       {message && <div className="mt-2">{message}</div>}
//     </div>
//   );
// };
