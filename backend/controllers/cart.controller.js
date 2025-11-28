import Cart from "../models/Cart.js";
import Product from "../models/Products.js";

// GET /api/cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId"
    );

    return res.status(200).json({ cart: cart || { items: [] } });
  } catch (err) {
    console.error("getCart error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/cart/add
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isAvailable) {
      return res.status(400).json({ message: "Product not available" });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user.id,
        items: [{ productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      await cart.save();
    }

    return res.status(200).json({ message: "Added to cart", cart });
  } catch (err) {
    console.error("addToCart error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/cart/update
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1)
      return res.status(404).json({ message: "Item not in cart" });

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    return res.status(200).json({ message: "Cart updated", cart });
  } catch (err) {
    console.error("updateCartItem error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/cart/item/:productId
export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();

    return res
      .status(200)
      .json({ message: "Item removed from cart", cart });
  } catch (err) {
    console.error("removeCartItem error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/cart/clear
export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user.id });
    return res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    console.error("clearCart error", err);
    return res.status(500).json({ message: "Server error" });
  }
};
