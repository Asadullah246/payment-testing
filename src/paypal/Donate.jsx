import { OneTimeDonation } from "./OneTimeDonation";
import { PayPalProviderWrapper } from "./PaypalProvider";
import { RecurringDonation } from "./RecurringDonation";

export const DonatePage = ({ paymentSessionId }) => (
  <PayPalProviderWrapper>
    <div>
      {/* <h1>paypal checking</h1> */}
      <OneTimeDonation paymentSessionId={paymentSessionId} />

      <div className="text-black " style={{ marginTop: "60px" }}>
        Recurring donation
      </div>
      <RecurringDonation paymentSessionId={paymentSessionId} />
    </div>
  </PayPalProviderWrapper>
);
