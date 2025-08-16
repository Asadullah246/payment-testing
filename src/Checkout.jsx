import React, { useState } from "react";
import {
  PaymentElement,
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51L0j6aDZSfscydCvyyzWeKWGIH1V4Z6vvtM2MwLwtdtmZHhWbnA5xfuZNYbRLRhkbBc9bgJ5adq6s7DKRbQQCUFC00fPnmRaCz"
);

export const apiUrl = "http://localhost:8080/api/v1";

const CheckoutForm = ({paymentSessionId}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [customerName, setCustomerName] = useState(`Test ${(Math.random() * 9000)}`);
  const [customerEmail, setCustomerEmail] = useState(`Test${(Math.random() * 9000)}@gmail.com`);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError(null);
    if (!stripe || !elements) return;

    if (!customerEmail || !customerName) {
      setError("Name and email are required.");
      return;
    }

    setProcessing(true);

    // try {
    // 1. Prepare checkout on backend: get SetupIntent client secret

    if(!paymentSessionId) {
      alert("payment session id not found")
      return ; 
    }
    const prepResp = await fetch(`${apiUrl}/payment/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        paymentSessionId: paymentSessionId,
        paymentGateway: "Stripe",       
      }),
    }).then((r) => r.json());
    console.log("prepResp", prepResp);
    const {
      setupIntentClientSecret,
      customerId,
    } = prepResp.data;

    
    if (!setupIntentClientSecret) {
      throw new Error("Failed to get SetupIntent client secret");
    }

    // 2. Confirm card setup to get payment method (recurring & off-session capability)
    const { error: setupError, setupIntent } = await stripe.confirmCardSetup(
      setupIntentClientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: customerName,
            email: customerEmail,
          },
        },
      }
    );
    if (setupError) {
      console.log("setuperror", setupError);
      throw setupError;
    }
    console.log("setupIntent", setupIntent);

    const paymentMethodId = setupIntent.payment_method;

    // 3. Send unified checkout payload to backend
    const payload = {
      stripeCustomerId: customerId,
      paymentMethodId,
      paymentSessionId: paymentSessionId,
      paymentGateway: "Stripe",
    };

    const checkoutResp = await fetch(`${apiUrl}/payment/finalize-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    }).then((r) => r.json());
    console.log("checkoutResp", checkoutResp);
    // 4. Handle required actions (SCA) for one-time payment or first invoice
    // PaymentIntent
    if (checkoutResp.paymentIntent) {
      const pi = checkoutResp.paymentIntent;
      if (pi.status === "requires_action") {
        const { error: confirmError } = await stripe.confirmCardPayment(
          pi.clientSecret
        );
        if (confirmError) throw confirmError;
      }
    }

    // Subscription first invoice payment (if needs action)
    if (
      checkoutResp.subscription?.latestInvoice?.payment_intent?.status ===
      "requires_action"
    ) {
      const clientSecret =
        checkoutResp.subscription.latestInvoice.payment_intent.client_secret;
      const { error: subConfirmError } = await stripe.confirmCardPayment(
        clientSecret
      );
      if (subConfirmError) throw subConfirmError;
    }

    setProcessing(false);
    setResult(checkoutResp.message ?? "payment successfull");
    // } catch (err) {
    //   console.error(err);
    //   setError(err.message || "Checkout failed");
    // } finally {
    //   setProcessing(false);
    // }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
    <h1>Stripe checking</h1>

      <form onSubmit={handleCheckout}>
        <div style={{ marginBottom: 12 }}>
          <label>
            Name
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            Email
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            Card details
            <div
              style={{
                padding: 10,
                border: "1px solid #ccc",
                borderRadius: 6,
                marginTop: 4,
              }}
            >
              <CardElement />
            </div>
          </label>
        </div>
        {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
        <button
          type="submit"
          // disabled={!stripe || processing}
          style={{
            padding: "10px 20px",
            background: "#6772e5",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          {processing ? "Processing..." : "Pay & Subscribe"}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h4>Result</h4>
          <pre style={{ background: "#f5f5f5", padding: 10, color: "black" }}>
            {result}
          </pre>
        </div>
      )}
    </div>
  );
};

const Checkout = ({paymentSessionId}) => {
  // We can optionally prefetch a SetupIntent here by calling backend to get client secret,
  // but our form does that on submit.
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm paymentSessionId={paymentSessionId} />
    </Elements>
  );
};

export default Checkout;
