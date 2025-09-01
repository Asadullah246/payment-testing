import { useParams } from "react-router-dom";
import Checkout from "../Checkout";
import { DonatePage } from "../paypal/Donate";
import SslPaymentPage from "../sslcommerz";

export default function CheckoutPage() {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Complete Your Payment
      </h1>

      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-black">SSL Commerz Payment</h2>
          <SslPaymentPage paymentSessionId={id} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-black">PayPal Payment</h2>
          <DonatePage paymentSessionId={id} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-black">Stripe Payment</h2>
          <Checkout paymentSessionId={id} />
        </div>
      </div>
    </div>
  );
}
