<template>
  <div v-for="item in cartItems" :key="item.id" class="product-container">
      <img :src="item.imageUrl" alt="Product Image" class="product-image">
      <div class="details-wrap">
        <h3>{{ item.name }}</h3>
        <p>Price: ${{ item.price }}</p>
      </div>
      <button @click="$emit('remove-from-cart',item.id)" class="remove-button">Remove from Cart</button>
  </div>
</template>

<script>

export default {
  name: 'CartItems',
  props: {
    cartItems: {
      type: Array,
      required: true
    }
  }
}
</script>