## create session api payload 


* api url :  /payment/create-session
* method : post 
* sample data : 

{
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
    currency: "USD", 
    donationItems: [
      {
        itemType: "Event",
        itemId: "f56a4b3c-b9d1-4e45-9fd6-faad070e9f61",
        paymentFrequency: "Monthly",
        paymentType: "Regular",
        amount: 200,
        giftAid:25,
        quantity: 2,
      },
      {
        itemType: "Appeal",
        itemId: "f56a4b3c-b9d1-4e45-9fd6-faad070e9f61",
        paymentFrequency: "Single",
        paymentType: "Single",
        amount: 330,
        giftAid:25,
        quantity: 5,
      },
    ],
  }

  * result:  {
    id
  }


  ##  checkout api 

  * api url : /payment/checkout
  * method : post 
  * data : {
    paymentSessionId: paymentSessionId( from url)
    paymentGateway: Stripe or Paypal or Sslcommerz
  }

  * result : 

   for stripe:

      {setupIntentClientSecret,
      customerId,}

   for paypal: { id }

   for sslcommerz: {redirectUrl} to redirect


   ## finalize payment (needed only for stripe and paypal single payment) :

    * api url : /payment/finalize-payment
    * method : post 
    * data : {
        paymentGateway: Stripe or Paypal,
        paymentSessionId: paymentSessionId,
        stripeCustomerId ( for stripe only),
        paymentMethodId  ( for stripe only),
        paypalOrderId  ( for paypal only),
        
    }


    
