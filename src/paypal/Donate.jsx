import { OneTimeDonation } from "./OneTimeDonation";
import { PayPalProviderWrapper } from "./PaypalProvider";
import { RecurringDonation } from "./RecurringDonation";

export const DonatePage = () => (
  <PayPalProviderWrapper>
    <div>
      <h1>paypal checking</h1>
      <OneTimeDonation amount="2.00" currency="GBP" />

<div style={{marginTop:"60px"}}></div>
      <RecurringDonation />

    </div>
  </PayPalProviderWrapper>
);
