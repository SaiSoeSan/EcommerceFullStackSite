import { createApp } from "vue";
import App from "./App.vue";
import "./assets/main.css";
import * as VueRouter from "vue-router";
import ShoppingCart from "./pages/ShoppingCart.vue";
import ProdutsList from "./pages/ProductsList.vue";
import ProductDetails from "./pages/ProductDetails.vue";
import NotFound from "./pages/NotFound.vue";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
initializeApp(firebaseConfig);

createApp(App)
  .use(
    VueRouter.createRouter({
      history: VueRouter.createWebHistory(process.env.BASE_URL),
      routes: [
        {
          path: "/",
          redirect: "/products",
        },
        {
          path: "/cart",
          component: ShoppingCart,
        },
        {
          path: "/products",
          component: ProdutsList,
        },
        {
          path: "/products/:id",
          component: ProductDetails,
        },
        {
          path: "/:pathMatch(.*)*",
          component: NotFound,
        },
      ],
    })
  )
  .mount("#app");
