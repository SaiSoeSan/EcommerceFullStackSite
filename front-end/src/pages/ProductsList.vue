<template>
  <h1>Products</h1>
  <ProductItems :product-array="products" />
</template>

<script>
import ProductItems from '../components/ProductItems.vue';
import axios from 'axios';

export default {
  name: 'ProductsList',
  components: {
    ProductItems
  },
  data() {
    return {
      products: []
    }
  },
  async created() {
    const response = await axios.get('/api/products');
    const product = response.data;
    this.products = product;
  }
}
</script>