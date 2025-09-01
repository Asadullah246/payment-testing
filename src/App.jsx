import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DonationForm from "./Formpage";
import CheckoutPage from "./pages/CheckoutPage";
import { SuccessPage, FailedPage, CancelledPage } from "./pages/StatusPages";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8">
          <Routes>
            <Route path="/" element={<DonationForm />} />
            <Route path="/checkout/:id" element={<CheckoutPage />} />
            <Route path="/success/:id" element={<SuccessPage />} />
            <Route path="/failed/:id" element={<FailedPage />} />
            <Route path="/cancelled/:id" element={<CancelledPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
