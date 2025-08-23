import { useState } from "react";
import { apiUrl } from "./Checkout";

export default function DonationForm({ setFormState, setPaymentSessionId }) {
  const [form, setForm] = useState({
    email: "test1@gmail.com",
    name: "test 1",
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
    currency: "USD", // need to modify=================
    donationItems: [
      {
        itemType: "Event",
        itemId: "f56a4b3c-b9d1-4e45-9fd6-faad070e9f61",
        paymentFrequency: "Monthly",
        paymentType: "Regular",
        amount: 23,
        giftAid:25,
        quantity: 2,
      },
      {
        itemType: "Event",
        itemId: "f56a4b3c-b9d1-4e45-9fd6-faad070e9f61",
        paymentFrequency: "Single",
        paymentType: "Single",
        amount: 330,
        giftAid:25,
        quantity: 5,
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDonationItemChange = (index, field, value) => {
    setForm((prev) => {
      const newItems = [...prev.donationItems];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, donationItems: newItems };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("value", form);

    try {
      const res = await fetch(`${apiUrl}/payment/create-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      }).then((r) => r.json());

      console.log("prepResp", res);
      setPaymentSessionId(res.data.id);
      setFormState(false);
    } catch (err) {
      console.error("Error submitting form", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="border p-2 w-full"
      />
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
        className="border p-2 w-full"
      />
      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone"
        className="border p-2 w-full"
      />

      {/* Address */}
      {Object.keys(form.address).map((key) => (
        <input
          key={key}
          name={`address.${key}`}
          value={form.address[key]}
          onChange={handleChange}
          placeholder={key}
          className="border p-2 w-full"
        />
      ))}

      <input
        name="contactWay"
        value={form.contactWay}
        onChange={handleChange}
        placeholder="Contact Way"
        className="border p-2 w-full"
      />
      <input
        name="reason"
        value={form.reason}
        onChange={handleChange}
        placeholder="Reason"
        className="border p-2 w-full"
      />
      <textarea
        name="notes"
        value={form.notes}
        onChange={handleChange}
        placeholder="Notes"
        className="border p-2 w-full"
      />
      {/* <input
        name="paymentGateway"
        value={form.paymentGateway}
        onChange={handleChange}
        placeholder="Payment Gateway"
        className="border p-2 w-full"
      /> */}
      <input
        name="currency"
        value={form.currency}
        onChange={handleChange}
        placeholder="Currency"
        className="border p-2 w-full"
      />

      {/* Donation Items */}
      {form.donationItems.map((item, idx) => (
        <>
          {Object.keys(item).map((field) => (
            <input
              key={field}
              value={item[field]}
              onChange={(e) =>
                handleDonationItemChange(idx, field, e.target.value)
              }
              placeholder={field}
              className="border p-1 m-1 w-full"
            />
          ))}
        </>
      ))}

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Submit
      </button>
    </form>
  );
}


