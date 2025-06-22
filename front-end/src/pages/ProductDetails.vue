<template>
  <div v-if="product">
    <div class="img-wrap">
      <img :src="product.imageUrl" :alt="product.name" />
    </div>
    <div class="product-details">
      <h1>{{ product.name }}</h1>
      <h3 class="price">{{ product.price }}</h3>
      <button @click="addToCart" v-if="user && !product.isInCart" class="add-to-cart">Add to Cart</button>
      <button v-if="user && product.isInCart" class="grey-button add-to-cart">Already in Cart</button>
      <button class="sign-in add-to-cart" @click="signIn" v-if="!user">Sign in to add to cart</button>
    </div>
  </div>
  <div v-else>
    <h1>Product not found</h1>
  </div>
</template>

<script>
import {getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink} from 'firebase/auth';
import axios from 'axios';
export default {
  name: 'ProductDetails',
  props: {
    user: Object
  },
  data() {
    return {
      product: {},
    };
  },
  async created() {
    const auth = getAuth();
    if (isSignInWithEmailLink(auth, window.location.href)) {
      await signInWithEmailLink(auth, window.localStorage.getItem('emailForSignIn'), window.location.href)
        .then((result) => {
          alert('Successfully signed in:', result);
          window.localStorage.removeItem('emailForSignIn');
        })
        .catch((error) => {
          console.error('Error signing in:', error);
        });
    }
    const response = await axios.get(`/api/products/${this.$route.params.id}`,{
      headers: {
        'Content-Type': 'application/json',
        'X-user-id': this.user ? this.user.uid : null
      }
    });
    this.product = response.data;
  },
  methods: {
    async addToCart() {
      try {
        await axios.post(`/api/users/${this.user.uid}/cart`, { id: this.product.id });
        alert('Product added to cart successfully!');
      } catch (error) {
        console.error('Error adding product to cart:', error);
        alert('Failed to add product to cart.');
      }
    },
    async signIn() {
      const email = prompt('Please enter your email to sign in:');
      if(!email) {
        alert('Email is required to sign in.');
        return;
      }
      const auth = getAuth();
      const actionCodeSettings = {
        url: `https://curly-zebra-9q65qv5756x2xqjx-8080.app.github.dev/products/${this.$route.params.id}`,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth,email,actionCodeSettings);
      alert(`Sign-in link sent to ${email}. Please check your email to complete the sign-in process.`);
      window.localStorage.setItem('emailForSignIn', email);
    }
  }
};
</script>