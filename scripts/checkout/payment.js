import { calculateCartQuantity, cart, clearCart } from "../data/cart.js";
import { getDeliveryOption } from "../data/deliveryoptions.js";
import { addOrder } from "../data/order.js";
import { getProduct} from "../data/products.js";
import { formatCurrency } from "../utils/money.js";

export function renderPaymentSummary() {

  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach((cartItem) => {
    const { productId, deliveryOptionId } = cartItem;

    const matchingProduct = getProduct(productId)
    const deliveryoption = getDeliveryOption(deliveryOptionId);

    productPriceCents += matchingProduct.priceCents * cartItem.quantity;
    shippingPriceCents += deliveryoption.priceCents;
  });


  const totalB4Tax = productPriceCents + shippingPriceCents;
  
  const tax = totalB4Tax * 0.1;

  const orderTotal = totalB4Tax + tax;

 let cartQuantity = calculateCartQuantity();

  const paymentSummaryHTML = `
      <h4>Order Summary</h4>

          <div class="d-flex justify-content-between">
            <span class="cart-item-quantity">Items (${cartQuantity}):</span>
            <span>$${formatCurrency(productPriceCents)}</span>
          </div>
          <div class="d-flex justify-content-between">
            <span>Shipping & handling:</span>
            <span>$${formatCurrency(shippingPriceCents)}</span>
          </div>
          <div class="d-flex justify-content-between">
            <span class="pt-2">Total before tax:</span>
            <span class="total-b4-tax pt-2">$${formatCurrency(totalB4Tax)}</span>
          </div>
          <div class="d-flex justify-content-between">
            <span>Estimated tax (10%):</span>
            <span>$${formatCurrency(tax)}</span>
          </div>
          <div class="d-flex justify-content-between order-total">
            <span>Order total:</span>
            <span>$${formatCurrency(orderTotal)}</span>
          </div>
          <button class="btn btn-dark place-order js-place-order-btn">Place your order</button>
  `
  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

  document.querySelector('.js-place-order-btn').addEventListener('click', async () => {
    const response = await fetch('https://supersimplebackend.dev/orders', {
      method: 'POST',
      headers: {
        'Content-type' : 'application/json'
      },
      body: JSON.stringify({
        cart
      })
    });

    const order = await response.json();
    addOrder(order);
    
    clearCart();
    window.location.href = 'orders.html'
  })

  
};

