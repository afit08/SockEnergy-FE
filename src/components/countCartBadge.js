import { dataAPI } from "$utils/axios";

export async function countCartBadge() {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const res = await dataAPI.get(`carts/showCarts`);
      const carts = res.data.data.result.length;

      return carts;
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log("tidak ada token");
    return 0;
  }
}

export function updateCartCountUI(newCartCount) {
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = newCartCount;
  }
}
