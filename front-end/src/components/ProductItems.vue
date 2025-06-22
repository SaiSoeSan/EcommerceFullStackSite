<template>
  <div class="grid-wrap">
    <div v-for="product in productArray" :key="product.id" class="product-item">
      <img :src="product.imageUrl" alt="Product Image" />
      <h3 class="product-name">{{ product.name }}</h3>
      <p class="product-price">Price: ${{ product.price }}</p>
      <router-link :to="'/products/' + product.id">
        <button>View Details</button>
      </router-link>
    </div>
  </div>
</template>

<script>

export default {
  name : 'ProductItems',
  props: {
    productArray: {
      type: Array,
      required: true
    }
  }
}
</script>