import {
  calculateCartQuantity,
  cart,
  removeFromCart,
  saveNewQuantity,
  updateDeliveryOption,
} from "../data/cart.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { getProduct } from "../data/products.js";
import { deliveryOptions, getDeliveryOption } from "../data/deliveryoptions.js";
import { formatCurrency } from "../utils/money.js";
import { renderPaymentSummary } from "./payment.js";

export function renderCartSummary(params) {
  updateQuantity();
  let cartSummaryHTML = "";
  cart.forEach((cartItem) => {
    const { productId, deliveryOptionId } = cartItem;

    const matchingProduct = getProduct(productId);

    const deliveryoption = getDeliveryOption(deliveryOptionId);
    const today = dayjs();
    const deliveryDate = today.add(deliveryoption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    cartSummaryHTML += `
    <div class="cart-summary js-cart-summary-${matchingProduct.id}">

          <h4 class="text-success">Delivery date: ${dateString}</h4>
  
          <div class="cart-item-details">
            <div class="d-flex">
              <div class="img-container">
                <img src="${matchingProduct.image}" alt="">
              </div>
  
              <div class="cart-details">
                <div class="product-name text-to-2-lines">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="cart-update">
                  <span class="quantity-label">
                    Quantity: <span class="cart-quantity js-cart-quantity-${
                      matchingProduct.id
                    }">${cartItem.quantity}</span>
                  </span>
                  <input type="text" class="input-quantity js-input-quantity-${
                    matchingProduct.id
                  }" />
                  <span class="text-primary save-quantity js-save-quantity"
                  data-product-id = ${matchingProduct.id}>Save</span>
                  <span class="update-quantity js-update-quantity text-primary"
                  data-product-id = ${matchingProduct.id}>
                    Update
                  </span>
                  <span class="delete-item js-delete-item text-danger"
                  data-product-id = ${matchingProduct.id}>
                    Delete
                  </span>
                </div>
  
  
              </div>
            </div>
  
  
            <div class="delivery-options-details">
              <div class="delivery-title">
                Choose a delivery option:
              </div>
              
              ${deliveryOptionHTML(matchingProduct, cartItem)}
              
              
            </div>
  
          </div>
        </div>
  `;
  });

  document.querySelector(".js-cart-summary-container").innerHTML =
    cartSummaryHTML;

  // generate delivery option HTML
  function deliveryOptionHTML(matchingProduct, cartItem) {
    let html = "";

    deliveryOptions.forEach((deliveryoption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryoption.deliveryDays, "days");
      const dateString = deliveryDate.format("dddd, MMMM D");

      const priceString =
        deliveryoption.priceCents === 0
          ? "FREE"
          : `$${formatCurrency(deliveryoption.priceCents)} - `;

      const isChecked = deliveryoption.id === cartItem.deliveryOptionId;

      html += `
        <div class="delivery-details js-delivery-details"
        data-product-id = "${matchingProduct.id}"
        data-delivery-option-id = "${deliveryoption.id}">
                <input type="radio"  ${isChecked ? "checked" : ""}
                name=delivery-option-${matchingProduct.id} />
                <div class="delivery-option">
                  <div class="delivery-date">${dateString}</div>
                  <div class="shipping">${priceString} Shipping</div>
                </div>
         </div>
    `;
    });
    return html;
  }

  // delivery option interactive
  document.querySelectorAll(".js-delivery-details").forEach((e) => {
    e.addEventListener("click", () => {
      const { productId, deliveryOptionId } = e.dataset;

      updateDeliveryOption(productId, deliveryOptionId);

      renderCartSummary();
      renderPaymentSummary();
    });
  });

  // delete button
  document.querySelectorAll(".js-delete-item").forEach((link) => {
    link.addEventListener("click", () => {
      const { productId } = link.dataset;

      const container = document.querySelector(`.js-cart-summary-${productId}`);
      container.remove();

      removeFromCart(productId);
      updateQuantity();
      renderPaymentSummary();
    });
  });

  // update cart quantity
  document.querySelectorAll(".js-update-quantity").forEach((link) => {
    link.addEventListener("click", () => {
      const { productId } = link.dataset;

      const container = document.querySelector(`.js-cart-summary-${productId}`);
      container.classList.add("edit-quantity");
    });
  });

  // save new cart quantity
  document.querySelectorAll(".js-save-quantity").forEach((link) => {
    link.addEventListener("click", () => {
      const { productId } = link.dataset;

      const inputQunatity = document.querySelector(
        `.js-input-quantity-${productId}`
      );
      const newQuantity = Number(inputQunatity.value);

      const container = document.querySelector(`.js-cart-summary-${productId}`);
      container.classList.remove("edit-quantity");

      saveNewQuantity(productId, newQuantity);

      document.querySelector(`.js-cart-quantity-${productId}`).innerHTML =
        newQuantity;

      updateQuantity();
      renderPaymentSummary();
    });
  });

  function updateQuantity(params) {
    let cartQuantity = calculateCartQuantity();

    document.querySelector(
      ".js-quantity-item"
    ).innerHTML = `${cartQuantity} items`;
  }
}
