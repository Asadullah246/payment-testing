import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const initialOptions = {
  'client-id': "AfVMKr_W0gQ2kP95dw7Spw4c0PZOTbdrBcO8t50k8DPm_KH8nM-J-frXyEbzEKREzxfxKuLQ-9KQfCv1" ,
  currency: 'GBP',
  intent: 'capture', // for one-time payments; subscription uses plan flow
  vault: true, // needed for subscriptions
};

export const PayPalProviderWrapper= ({ children }) => {
  return <PayPalScriptProvider options={initialOptions}>{children}</PayPalScriptProvider>;
};
