<template>
  <div class="nav-bar">
    <router-link to="/products" class="products-link">
      <div class="logo-wrap">
        <img :src="logo" alt="Logo" class="logo">
      </div>
    </router-link>
    
    <div class="nav-buttons-wrap cart-link">
      <router-link to="/cart">
        <button>Shopping Cart</button>
      </router-link>
      <button v-if="user" @click="signOut">Sign Out</button>
    </div>
  </div>
</template>

<script>
import logo from '@/assets/logo-hexagon.svg';
import {getAuth,signOut} from 'firebase/auth';
export default {
  name : 'NavBar',
  data() {
    return {
      logo
    }
  },
  methods: {
    signOut() {
      signOut(getAuth());
    }
  }
}
</script>