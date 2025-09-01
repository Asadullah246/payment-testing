import { useState } from "react";
import { apiUrl } from "./Checkout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  UserIcon,
  MapPinIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

export default function DonationForm() {
  const [form, setForm] = useState({
    email: "test1@gmail.com",
    name: "test 1",
    phone: "+8801897878765",
    address: {
      addressLine1: "123 Road",
      addressLine2: "Flat B3",
      city: "Dhaka",
      state: "Dhaka",
      postCode: "1207",
      country: "Bangladesh",
    },
    contactWay: ["Email"],
    reason: "Friend_family",
    notes: "Please keep me updated",
    currency: "USD",
    items: [
      {
        itemType: "Event",
        itemId: "f56a4b3c-b9d1-4e45-9fd6-faad070e9f61",
        itemTitle: "this is title",
        itemSlug: "this-is-title",
        frequency: "Monthly",
        paymentType: "Regular",
        donationOption: "Zakat", 
        amount: 2,
        quantity: 2,
        giftAid: true,
      },
      {
        itemType: "Appeal",
        itemId: "f56a4b3c-b9d1-4e45-9fd6-faad070e9f61",
        itemTitle: "this is title",
        itemSlug: "this-is-title-2",
        frequency: "Single",
        paymentType: "Single",
        donationOption: "Sadaqah",
        amount: 3,
        quantity: 2,
        giftAid: false,
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
    } else if (name === "contactWay") {
      setForm((prev) => ({ ...prev, [name]: [value] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDonationItemChange = (index, field, value) => {
    setForm((prev) => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${apiUrl}/payment/create-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      }).then((r) => r.json());

      if (res.data?.id) {
        // toast.success("Form submitted successfully!");
        navigate(`/checkout/${res.data.id}`);
      } else {
        toast.error("Error creating payment session");
      }
    } catch (err) {
      console.error("Error submitting form", err);
      toast.error("Error submitting form");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        {/* <div className="text-center mb-12 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Make a Difference Today
          </h1>
          <p className="text-lg text-gray-600">
            Your generosity helps change lives
          </p>
        </div> */}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <UserIcon className="h-6 w-6 text-blue-500 mr-2" />
                Personal Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="form-input block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base shadow-sm hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="form-input block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base shadow-sm hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="form-input block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Currency
                  </label>
                  <select
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                    className="form-select block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base shadow-sm hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:bg-white appearance-none"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="BDT">BDT - Bangladeshi Taka</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <MapPinIcon className="h-6 w-6 text-blue-500 mr-2" />
                Address Details
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(form.address).map((key) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {key.charAt(0).toUpperCase() +
                        key.slice(1).replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      name={`address.${key}`}
                      value={form.address[key]}
                      onChange={handleChange}
                      // placeholder={`Enter your ${key.toLowerCase()}`}
                      className="form-input block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <DocumentTextIcon className="h-6 w-6 text-blue-500 mr-2" />
                Additional Information
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Preference
                  </label>
                  <select
                    name="contactWay"
                    value={form.contactWay[0]}
                    onChange={handleChange}
                    className="form-select block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Email">Email</option>
                    <option value="Phone">Phone</option>
                    <option value="Both">Both Email and Phone</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How did you hear about us?
                  </label>
                  <select
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                    className="form-select block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Friend_family">Friend/Family</option>
                    <option value="Social_media">Social Media</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Add any special requests or additional information"
                    className="form-textarea block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-base shadow-sm hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:bg-white resize-y"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Donation Items */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-6">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-500 mr-2" />
              Donation Details
            </h2>
            {form.items.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Donation Item {idx + 1}
                  </h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {item.donationOption}
                  </span>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.keys(item).map((field) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field.charAt(0).toUpperCase() +
                            field.slice(1).replace(/([A-Z])/g, " $1")}
                        </label>
                        {field === "frequency" ? (
                          <select
                            value={item[field]}
                            onChange={(e) =>
                              handleDonationItemChange(
                                idx,
                                field,
                                e.target.value
                              )
                            }
                            className="form-select block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          >
                            <option value="Monthly">Monthly</option>
                            <option value="Single">Single</option>
                          </select>
                        ) : field === "donationOption" ? (
                          <select
                            value={item[field]}
                            onChange={(e) =>
                              handleDonationItemChange(
                                idx,
                                field,
                                e.target.value
                              )
                            }
                            className="form-select block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          >
                            <option value="Zakat">Zakat</option>
                            <option value="Sadaqah">Sadaqah</option>
                          </select>
                        ) : field === "giftAid" ? (
                          <select
                            value={item[field]}
                            onChange={(e) =>
                              handleDonationItemChange(
                                idx,
                                field,
                                e.target.value === "true"
                              )
                            }
                            className="form-select block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          >
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                        ) : field === "amount" ? (
                          <div className="relative mt-1 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-gray-500 sm:text-sm">
                                {form.currency}
                              </span>
                            </div>
                            <input
                              type="number"
                              value={item[field]}
                              onChange={(e) =>
                                handleDonationItemChange(
                                  idx,
                                  field,
                                  e.target.value
                                )
                              }
                              className="block w-full rounded-lg border-gray-300 pl-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              placeholder="0.00"
                              step="0.01"
                              min="0"
                            />
                          </div>
                        ) : (
                          <input
                            value={item[field]}
                            onChange={(e) =>
                              handleDonationItemChange(
                                idx,
                                field,
                                e.target.value
                              )
                            }
                            placeholder={`Enter ${field.toLowerCase()}`}
                            className="form-input block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105"
            >
              Proceed to Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
