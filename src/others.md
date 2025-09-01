



for single paypal payment : PAYMENT.CAPTURE.COMPLETED
the custom id field : custom_id

for single also: CHECKOUT.ORDER.APPROVED,  CHECKOUT.ORDER.APPROVED
the custom id field : purchase_units[0].custom_id



for recurring payment : PAYMENT.SALE.COMPLETED
the custom id field : custom



















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