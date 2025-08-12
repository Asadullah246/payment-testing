import React, { useState } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

export const RecurringDonation= () => {
  const [{ isPending }] = usePayPalScriptReducer();
  const [message, setMessage] = useState('');

  return (
    <div>
      <h2>Recurring donation</h2>
      {isPending && <div>Loading PayPal...</div>}
      <PayPalButtons
        style={{ layout: 'vertical' }}
        createSubscription={async () => {
          const resp = await fetch('http://localhost:8080/api/v1/payment/create-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                email: "test2@gmail.com",
                name: "test 2",
                phone: "01700000400",
                address: {
                  addressLine1: "13 Road",
                  addressLine2: "Flat 3",
                  city: "Dhaka",
                  state: "Dhaka",
                  postCode: "1307",
                  country: "Bangladesh",
                },
                contactWay: "Email",
                reason: "Friend_family",
                notes: "Please keep me updated",
                paymentGateway: "Paypal",
                currency: "GBP",
                donationItems: [
                  {
                    itemType: "Appeal",
                    itemId: "f56a4b3c-b9d1-4e45-9fd6-faad070e9f61",
                    amount: 8,
                    quantity: 2,
                    donationOption: "Zakat",
                    paymentFrequency: "Single",
                    paymentType: "Single",
                  },
                  {
                    itemType: "Appeal",
                    itemId: "f56a4b3c-b9d1-4e45-9fd6-faad070e9f61",
                    amount: 440,
                    quantity: 2,
                    donationOption: "Zakat",
                    paymentFrequency: "Monthly",
                    paymentType: "Regular",
                  },
                  // {
                  //   itemType: "Event",
                  //   itemId: "f56a4b3c-b9d1-4e45-9fd6-faad070e9f61",
                  //   paymentFrequency: "Single",
                  //   paymentType: "Single",
                  //   amount: 2,
                  //   quantity: 2,
                  // },
                  {
                    itemType: "Event",
                    itemId: "f56a4b3c-b9d1-4e45-9fd6-faad070e9f61",
                    paymentFrequency: "Monthly",
                    paymentType: "Regular",
                    amount: 6,
                    quantity: 3,
                  },
                ],
              }),
          });
          const data = await resp.json();
          console.log("data", data)
          if (!data?.data?.recurringRes?.id) {
            throw new Error('Failed to create subscription');
          }
          return data?.data?.recurringRes?.id; // PayPal subscription ID (the SDK needs this)
        }}
        onApprove={(data) => {
          setMessage('Subscription active! ID: ' + data.subscriptionID);
        }}
        onError={(err) => {
          console.error('Subscription error', err);
          setMessage('Subscription failed: ' + (err?.message || 'unknown'));
        }}
      />
      {message && <div className="mt-2">{message}</div>}
    </div>
  );
};
