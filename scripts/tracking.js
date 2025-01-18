import { placeOrder } from "./data/order.js";
import { getProduct, loadProductsFetch } from "./data/products.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

async function loadPage() {
  await loadProductsFetch();
  loadTrackingPage();
}

function loadTrackingPage() {
  
const url = new URL(window.location.href);
const orderId = url.searchParams.get('orderId');
const productId = url.searchParams.get('productId');

let matchingOrder;
placeOrder.map((order)=>{
   if (orderId === order.id) {
    matchingOrder = order
   }
});

const matchingProduct = getProduct(productId);

let matchTracking;
matchingOrder.products.forEach((product)=>{
  if (product.productId === matchingProduct.id) {
     matchTracking = product
  }
});

console.log(matchingOrder);
console.log(matchTracking);

  
const today = dayjs();
const orderTime = dayjs(matchingOrder.orderTime);
const estimatedDeliveryTime = dayjs(matchTracking.estimatedDeliveryTime);
const percentProgress = ((today - orderTime) / (estimatedDeliveryTime - orderTime) * 100)

 const arriveDeliver = today < estimatedDeliveryTime ? 'Arriving on' : 'Delivered'
  const trackingHTML = `<a href="orders.html" class="text-primary-emphasis">View all orders</a>

        <div class="d-grid mt-4">
          <h4 class="delivery-date">
            ${arriveDeliver} ${dayjs(matchTracking.estimatedDeliveryTime).format('dddd, MMMM D')}
          </h4>
          <span>${matchingProduct.name}</span>
          <span>Quantity: ${matchTracking.quantity}</span>
          <img class="product-image" src="${matchingProduct.image}" alt="">
        </div>

        <div class="progress-labels-container">
          <span class="${percentProgress < 50 ? 'current-status' : ''}">Preparing</span>
          <span class="${percentProgress > 50 && percentProgress < 100 ? 'current-status' : ''}">Shipped</span>
          <span class="${percentProgress >= 100 ? 'current-status' : ''}">Delivered</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar" style="width:${percentProgress}%"></div>
        </div>
        `

      document.querySelector('.js-track-product').innerHTML = trackingHTML;  

}

loadPage();
