import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import CheckoutAddress from "@/components/checkout/CheckoutAddress";
import CheckoutProducts from "@/components/checkout/CheckoutProducts";
import CheckoutCustomer from "@/components/checkout/CheckoutCustomer";
import CheckoutVoucher from "@/components/checkout/CheckoutVoucher";
import CheckoutPayment from "@/components/checkout/CheckoutPayment";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";
import CheckoutFooter from "@/components/checkout/CheckoutFooter";

const Checkout = () => {
  return (
    <div className="min-h-screen bg-background pb-28 max-w-md mx-auto">
      <CheckoutHeader />
      <CheckoutAddress />
      <CheckoutProducts />
      <CheckoutCustomer />
      <CheckoutVoucher />
      <CheckoutPayment />
      <CheckoutSummary />
      <CheckoutFooter />
    </div>
  );
};

export default Checkout;
