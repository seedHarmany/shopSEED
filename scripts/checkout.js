import { renderCartSummary } from "./checkout/cartSummary.js";
import { renderPaymentSummary } from "./checkout/payment.js";
import { loadProductsFetch } from "./data/products.js";

async function loadCheckoutPage() {
  await loadProductsFetch();
  renderCartSummary();
  renderPaymentSummary();
}

loadCheckoutPage()
