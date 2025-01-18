import { addToCart, calculateCartQuantity, cart } from "./data/cart.js";
import { loadProductsFetch, products } from "./data/products.js";

async function loadProduct() {
  await loadProductsFetch();

  renderProducts();
}

function renderProducts(params) {
  
updateQuantity();

let productSummaryHTML = '';

const url = new URL(window.location.href);
const search = url.searchParams.get('search');

let filteredProducts = products;

if (search) {
  filteredProducts = products.filter((product)=>{
    //  return product.name.includes(search)
    // return product.name.toLowerCase().includes(search.toLowerCase())

    let matchingKeyword = false;
   
    product.keywords.forEach((keyword)=>{
       if (keyword.toLowerCase().includes(search.toLowerCase())) {
        matchingKeyword = true;
       }
    });

    return matchingKeyword || product.name.toLowerCase().includes(search.toLowerCase())
   
  })
}

filteredProducts.forEach((product) => {

  productSummaryHTML += `<div class="product-container">
        <div class="img-container">
          <img class="product-image" src="${product.image}" alt="">
        </div>
        <p class="product-name text-to-2-lines">${product.name}</p>
        ${product.getRatingURL()}
        ${product.getPriceURL()}
        <div class="d-flex justify-content-between">
          <select name="" id="selectQuantity" class="js-select-quantity-${product.id}">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
       
          ${product.getExtraInfo()}
        </div>
        <div class="added js-added-${product.id}">
          <img src="images/icons/checkmark.png" alt="">
          <span>Added</span>
        </div>
        <button class="btn btn-dark js-add-to-cart-btn"
        data-product-id = ${product.id}>Add to cart</button>
      </div>`
});
document.querySelector('.js-products-grid').innerHTML = productSummaryHTML;

function searchBar() {
  const search = document.querySelector('.js-search-bar').value;
   
  window.location.href = `shopSEED.html?search=${search}`

}
document.querySelector('.js-search-btn').addEventListener('click', searchBar);

document.body.addEventListener('keydown', (e)=>{
    if (e.key === 'Enter') {
      searchBar();
    }
    
})

document.querySelectorAll('.js-add-to-cart-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const { productId } = button.dataset;

    addToCart(productId);
    addedMessageFun(productId)
    updateQuantity();
  });


});

let addedMessageTimeout = {};
function addedMessageFun(productId) {
  const previousTimeoutId = addedMessageTimeout[productId];

  if (previousTimeoutId) {
    clearTimeout(previousTimeoutId)
  }

  const addedMessage = document.querySelector(`.js-added-${productId}`);
  addedMessage.classList.add('opacity1');

  const timeout = setTimeout(() => {
    addedMessage.classList.remove('opacity1');
  }, 2000);

  addedMessageTimeout[productId] = timeout;
}

function updateQuantity() {
  let cartQuantity = calculateCartQuantity();

  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}

}

loadProduct()
