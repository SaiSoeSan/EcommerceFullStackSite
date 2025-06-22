import express from "express";
import { MongoClient } from "mongodb";

// Load environment variables from .env file
import * as dotenv from "dotenv";
dotenv.config();

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3000;
const username = process.env.DB_USERNAME;
const password = encodeURIComponent(process.env.DB_PASSWORD); // Encode password to handle special characters
const clusterUrl = process.env.DB_CLUSTER_URL;
const dbName = process.env.DB_NAME;
const appName = process.env.APP_NAME;
const url = `mongodb+srv://${username}:${password}@${clusterUrl}/?retryWrites=true&w=majority&appName=${appName}`;

async function startServer() {
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db(dbName);

  const app = express();
  // Middleware to parse JSON bodies

  // Serve static files from the Vue.js build folder
  app.use(express.static(path.join(__dirname, "../dist")));

  app.use("/images", express.static(path.join(__dirname, "../assets")));

  async function populatedCartItems(ids) {
    return Promise.all(
      ids.map((id) => db.collection("products").findOne({ id }))
    );
  }

  async function getProductById(id) {
    const product = await db.collection("products").findOne({ id });
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return product;
  }

  //Get cart items for a user
  app.get("/api/users/:userId/cart", async (req, res) => {
    const collection = db.collection("users");
    const user = await collection.findOne({ id: req.params.userId });
    const populatedCart = await populatedCartItems(user?.cartItems || []);
    res.json(populatedCart);
  });

  app.get("/api/products", async (req, res) => {
    const collection = db.collection("products");
    const products = await collection.find({}).toArray();
    res.json(products);
  });

  app.get("/api/products/:id", async (req, res) => {
    console.log(req.headers["x-user-id"]);
    const userId = req.headers["x-user-id"];
    const product = await getProductById(req.params.id);
    // check if the product is in the cart
    if (!userId) {
      product.isInCart = false;
    } else {
      const collection = db.collection("users");
      const user = await collection.findOne({ id: userId });
      if (!user) {
        product.isInCart = false;
      } else {
        const isInCart = user.cartItems.includes(product.id);
        product.isInCart = isInCart;
      }
    }
    res.json(product);
  });

  //add a product to cart
  app.post("/api/users/:userId/cart", async (req, res) => {
    const userId = req.params.userId;
    const productId = req.body.id;
    const collection = db.collection("users");

    // Check user is exists
    const existingUser = await collection.findOne({ id: userId });
    if (!existingUser) {
      collection.insertOne({ id: userId, cartItems: [] });
    }

    await collection.updateOne(
      { id: userId },
      {
        $addToSet: { cartItems: productId },
      }
    );

    const user = await collection.findOne({ id: userId });
    const populatedCart = await populatedCartItems(user?.cartItems || []);
    res.json(populatedCart);
  });

  //delete a product from cart
  app.delete("/api/users/:userId/cart/:productId", async (req, res) => {
    const productId = req.params.productId;
    const userId = req.params.userId;
    const collection = db.collection("users");

    await collection.updateOne(
      { id: userId },
      {
        $pull: { cartItems: productId },
      }
    );

    const user = await collection.findOne({ id: userId });
    const populatedCart = await populatedCartItems(user?.cartItems || []);
    res.json(populatedCart);
  });

  app.listen(port, () => {
    console.log("Server is running on http://localhost:" + port);
  });
}

startServer();
