import { useState } from "react";
import "./App.css";
import Checkout from "./Checkout";
import { DonatePage } from "./paypal/Donate";
import DonationForm from "./Formpage";
import SslPaymentPage from "./sslcommerz";

function App() {
  const [formState, setFormState] = useState(true);
  const [paymentSessionId, setPaymentSessionId]=useState(null)

  return (
    <>


      {formState ? (
        <DonationForm setFormState={setFormState}  setPaymentSessionId={setPaymentSessionId}/>
      ) : (
        <div>
          <button onClick={()=>setFormState(true)}>ge to form</button>
          <div style={{ margin: "60px 0" }}>
            <SslPaymentPage  paymentSessionId={paymentSessionId}/>
          </div>
          <DonatePage paymentSessionId={paymentSessionId} />
          <Checkout paymentSessionId={paymentSessionId} />
        </div>
      )}
    </>
  );
}

export default App;
