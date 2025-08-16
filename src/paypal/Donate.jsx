import { OneTimeDonation } from "./OneTimeDonation";
import { PayPalProviderWrapper } from "./PaypalProvider";
import { RecurringDonation } from "./RecurringDonation";

export const DonatePage = ({paymentSessionId}) => (
  <PayPalProviderWrapper>
    <div>
      <h1>paypal checking</h1>
      <OneTimeDonation  paymentSessionId={paymentSessionId} />

<div style={{marginTop:"60px"}}></div>
      <RecurringDonation paymentSessionId={paymentSessionId} />

    </div>
  </PayPalProviderWrapper>
);
