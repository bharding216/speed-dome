// cartStore.js
import { writable } from 'svelte/store';

const initialCartState = loadCartState(); // Load initial state from storage

export const cart = writable(initialCartState);

export const addToCart = (product) => {
  cart.update((cartItems) => {
    const updatedCart = [...cartItems, product];
    saveCartState(updatedCart); // Save updated state to storage
    return updatedCart;
  });
};

export const clearCart = () => {
  cart.set([]);
  clearCartState(); // Clear state from storage
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
