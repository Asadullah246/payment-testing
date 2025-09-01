import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiUrl } from "../Checkout";
import { toast } from "react-toastify";

function StatusPage({ type }) {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/payment/status/${id}`, {
          credentials: "include",
        });
        const result = await response.json();
        setData(result.data);

        // Show notification based on status
        if (type === "success") {
          toast.success("Payment completed successfully!");
        } else if (type === "failed") {
          toast.error("Payment failed. Please try again.");
        } else if (type === "cancelled") {
          toast.info("Payment was cancelled.");
        }
      } catch (error) {
        console.error("Error fetching status:", error);
        toast.error("Error fetching payment status");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, type]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const getStatusContent = () => {
    switch (type) {
      case "success":
        return {
          title: "Payment Successful!",
          message:
            "Thank you for your donation. Your payment has been processed successfully.",
          color: "text-green-600",
          bgColor: "bg-green-100",
        };
      case "failed":
        return {
          title: "Payment Failed",
          message:
            "Unfortunately, your payment could not be processed. Please try again or contact support.",
          color: "text-red-600",
          bgColor: "bg-red-100",
        };
      case "cancelled":
        return {
          title: "Payment Cancelled",
          message:
            "Your payment has been cancelled. Feel free to try again when you're ready.",
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
        };
      default:
        return {
          title: "Payment Status",
          message: "Unknown payment status",
          color: "text-gray-600",
          bgColor: "bg-gray-100",
        };
    }
  };

  const statusContent = getStatusContent();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div
        className={`max-w-lg w-full ${statusContent.bgColor} p-8 rounded-lg shadow-md`}
      >
        <h1 className={`text-3xl font-bold mb-4 ${statusContent.color}`}>
          {statusContent.title}
        </h1>
        <p className="text-gray-700 mb-6">{statusContent.message}</p>

        {data && (
          <div className="bg-white p-4 rounded-md shadow">
            <h2 className="text-xl font-semibold mb-3">Payment Details</h2>
            <dl className="grid grid-cols-1 gap-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Amount</dt>
                <dd className="text-lg">
                  {data.amount} {data.currency}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Transaction ID
                </dt>
                <dd className="text-lg">{data.transactionId || id}</dd>
              </div>
              {data.paymentMethod && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Payment Method
                  </dt>
                  <dd className="text-lg">{data.paymentMethod}</dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}

export function SuccessPage() {
  return <StatusPage type="success" />;
}

export function FailedPage() {
  return <StatusPage type="failed" />;
}

export function CancelledPage() {
  return <StatusPage type="cancelled" />;
}
