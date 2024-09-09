// cartStore.js
import { writable } from 'svelte/store';

const initialCartState = loadCartState(); // Load initial state from storage

export const cart = writable(initialCartState);

export const addToCart = (product, quantity) => {
  cart.update((cartItems) => {
    const numQuantity = Number(quantity);

    const existingProduct = cartItems.find((item) => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 0) + numQuantity;
    } else {  
      cartItems.push({ ...product, quantity: numQuantity });
    }

    saveCartState(cartItems);
    return cartItems;
  });
};

export const clearCart = () => {
  cart.set([]);
  clearCartState();
};

// Helper functions for storage
function loadCartState() {
  if (typeof window !== 'undefined') {
    const storedState = localStorage.getItem('cartState');
    return storedState ? JSON.parse(storedState) : [];
  }
  return [];
}

function saveCartState(state) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cartState', JSON.stringify(state));
  }
}

function clearCartState() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('cartState');
  }
}
