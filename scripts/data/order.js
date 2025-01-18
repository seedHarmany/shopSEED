export const placeOrder = JSON.parse(localStorage.getItem('place-order')) || [];

export function addOrder(order) {
  placeOrder.unshift(order);
  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem('place-order', JSON.stringify(placeOrder))
}