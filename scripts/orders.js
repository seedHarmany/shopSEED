import { placeOrder } from "./data/order.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { formatCurrency } from "./utils/money.js";
import { getProduct, loadProductsFetch } from "./data/products.js";
import { calculateCartQuantity, cart, saveToStorage } from "./data/cart.js";

async function loadOrders(params) {
  await loadProductsFetch();
  loadOrderPage();
}

function loadOrderPage() {
  updateQuantity();

  function updateQuantity() {
    let cartQuantity = calculateCartQuantity();
  
    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
  }

  let orderSummaryHTML = "";
  placeOrder.forEach((order) => {
    orderSummaryHTML += `
      <div class="bg-body-secondary order-details">
          <div class="details">
            <span class="fw-semibold">Order Placed:</span>
            <span>${dayjs(order.orderTime).format("MMMM D")}</span>
          </div>
          <div class="details">
            <span class="fw-semibold">Total:</span>
            <span>$${formatCurrency(order.totalCostCents)}</span>
          </div>
          <div class="details order-id">
            <span class="fw-semibold">Order ID:</span>
            <span>${order.id}</span>
          </div>
        </div>
      
        ${orderProductHTML(order)}
   
   `;
  });
  document.querySelector(".js-orders").innerHTML = orderSummaryHTML;

  function orderProductHTML(order) {
    let html = "";

    order.products.forEach((orderProduct) => {
      const { productId } = orderProduct;

      let matchingProduct = getProduct(productId);

      html += `
         <div class="order-product-container">
         <div class="d-flex align-items-center justify-content-center">
            <div class="img-container">
              <img src="${matchingProduct.image}" alt="">
            </div>
         </div>
         

          <div class="product-details-container">
            <div class="product-details lh-sm">
              
                <div class="fw-semibold product-name">${
                  matchingProduct.name
                }</div>
              
                <span class="mt-1">Arriving on: ${dayjs(
                  orderProduct.estimatedDeliveryTime
                ).format("MMMM D")}</span>
                <span class="mt-1">Quantity: ${orderProduct.quantity}</span>
              <button class="bg-success mt-2 js-buy-again"
              data-product-id = ${productId}>
                <i class="bi bi-recycle me-2"></i>
                Buy again
              </button>
            </div>
            
              <a href="tracking.html?orderId=${order.id}&productId=${productId}">
              
                 <button class="track-package">Track Package</button>
              </a>
          </div>
        </div>
    `;
    });
    return html;
  }

  document.querySelectorAll(".js-buy-again").forEach((e) => {
    e.addEventListener("click", () => {
      const { productId } = e.dataset;

      let matchingProduct;
      cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
          matchingProduct = cartItem;
        }
      });

      if (matchingProduct) {
        matchingProduct.quantity += 1;
      } else {
        cart.push({
          productId,
          quantity: 1,
          deliveryOptionId: "1",
        });
      }

      saveToStorage();
    });
  });
}

loadOrders();
