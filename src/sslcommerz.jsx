
export default function SslPaymentPage({paymentSessionId}) {

  const handlePay = async () => {
    try {

      if(!paymentSessionId) {
        alert("ps id not found")
      }
      const res = await fetch(
        `https://singular-secondly-skylark.ngrok-free.app/api/v1/payment/checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
             body: JSON.stringify({
        donationId: paymentSessionId,
        paymentGateway: "Sslcommerz",       
      }),
        }
      );

      const data = await res.json();
      console.log("data ", data)
      // return ; 
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
