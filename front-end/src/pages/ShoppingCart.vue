<template>
  <h1>Shopping Cart</h1>
  <div v-if="cartItems.length === 0">Your cart is empty.</div>
  <div v-else>
    <CartItems @remove-from-cart="onRemoveFromCart($event)" :cart-items="cartItems" />
    <button class="checkout-button">Checkout</button>
  </div>
</template>

<script>
import CartItems from '../components/CartItems.vue'
import axios from 'axios';
export default{
  name: 'ShoppingCart',
  props: {
    user: Object
  },
  data() {
    return {
      cartItems: []
    }
  },
  components: {
    CartItems
  },
  async created() {
    console.log('User:', this.user);
    if(this.user){
      const response = await axios.get(`/api/users/${this.user.uid}/cart`);
      this.cartItems = response.data;
    }
  },
  methods: {
    async onRemoveFromCart(productId) {
      try {
        const response = await axios.delete(`/api/users/12345/cart/${productId}`);
        this.cartItems = response.data;
        alert('Product removed from cart successfully!');
      } catch (error) {
        console.error('Error removing product from cart:', error);
        alert('Failed to remove product from cart.');
      }
    }
  }
}
</script>