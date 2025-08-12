// src/pages/SslPaymentPage.tsx
import { useState } from "react";

// interface Item {
//   name: string;
//   price: number;
//   type: "single" | "recurring";
//   frequency?: "weekly" | "monthly" | "yearly";
// }

export default function SslPaymentPage() {
  const [items, setItems] = useState([
    { name: "One-time Donation", price: 50, type: "single" },
    {
      name: "Monthly Support",
      price: 10,
      type: "recurring",
      frequency: "monthly",
    },
    {
      name: "Weekly Support",
      price: 5,
      type: "recurring",
      frequency: "weekly",
    },
  ]);
  const [customerName, setCustomerName] = useState(
    `Test ${Math.random() * 9000}`
  );
  const [customerEmail, setCustomerEmail] = useState(
    `Test${Math.random() * 9000}@gmail.com`
  );
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleItem = (item) => {
    setSelectedItems((prev) =>
      prev.find((i) => i.name === item.name)
        ? prev.filter((i) => i.name !== item.name)
        : [...prev, item]
    );
  };

  const handlePay = async () => {
    // if (selectedItems.length === 0) {
    //   alert("Please select at least one item.");
    //   return;
    // }

    try {
      const res = await fetch(
        `https://a088f3c16c9b.ngrok-free.app/api/v1/payment/create-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: customerEmail,
            name: customerName,
            phone: "01700000000",
            address: {
              addressLine1: "123 Road",
              addressLine2: "Flat B3",
              city: "Dhaka",
              state: "Dhaka",
              postCode: "1207",
              country: "Bangladesh",
            },
            contactWay: "Email",
            reason: "Friend_family",
            notes: "Please keep me updated",
            paymentGateway: "Sslcommerz",
            currency: "GBP",
            donationItems: [
              {
                itemType: "Appeal",
                itemId: "f56a4b3c-b9d1-4e45-9fd6-faad070e9f61",
                amount: 5,
                quantity: 2,
                donationOption: "Zakat",
                paymentFrequency: "Single",
                paymentType: "Single",
              },
            //   {
            //     itemType: "Appeal",
            //     itemId: "f56a4b3c-b9d1-4e45-9fd6-faad070e9f61",
            //     amount: 5,
            //     quantity: 3,
            //     donationOption: "Zakat",
            //     paymentFrequency: "Monthly",
            //     paymentType: "Regular",
            //   },
            //   {
            //     itemType: "Event",
            //     itemId: "f56a4b3c-b9d1-4e45-9fd6-faad070e9f61",
            //     paymentFrequency: "Single",
            //     paymentType: "Single",
            //     amount: 3,
            //     quantity: 2,
            //   },
            //   {
            //     itemType: "Event",
            //     itemId: "f56a4b3c-b9d1-4e45-9fd6-faad070e9f61",
            //     paymentFrequency: "Yearly",
            //     paymentType: "Regular",
            //     amount: 4,
            //     quantity: 3,
            //   },
            ],
          }),
        }
      );

      const data = await res.json();
      console.log("data ", data.data.redirectUrl)
      if (data?.data?.redirectUrl) {
        window.location.href = data.data.redirectUrl; 
      } else {
        alert("Failed to create payment session.");
      } 
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>SSLCOMMERZ Payment</h2>
      <ul>
      </ul>
      <button onClick={handlePay}>Pay Now</button>
    </div>
  );
}
