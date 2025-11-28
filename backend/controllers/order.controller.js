import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Products.js";

// POST /api/orders/checkout
// payload optional: { addressId, paymentStatus }
export const checkoutFromCart = async (req, res) => {
  try {
    const { paymentStatus = "PENDING" } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      "items.productId"
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // calculate total and freeze price
    let totalAmount = 0;
    const orderItems = cart.items.map((item) => {
      const price = item.productId.price; // current price
      totalAmount += price * item.quantity;
      return {
        productId: item.productId._id,
        quantity: item.quantity,
        price,
      };
    });

    const order = await Order.create({
      userId: req.user.id,
      items: orderItems,
      totalAmount,
      paymentStatus,
      status: "PENDING",
      timeline: [{ status: "PENDING", time: new Date() }],
    });

    // Optionally reduce stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // clear cart
    await Cart.deleteOne({ _id: cart._id });

    return res
      .status(201)
      .json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("checkoutFromCart error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/orders/my
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("items.productId");

    return res.status(200).json({ orders });
  } catch (err) {
    console.error("getMyOrders error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/orders/:id
export const getOrderByIdUser = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).populate("items.productId");

    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.status(200).json({ order });
  } catch (err) {
    console.error("getOrderByIdUser error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ============ ADMIN ORDER CONTROLS ============ //

// GET /api/admin/orders
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email")
      .populate("deliveryBoyId");

    return res.status(200).json({ orders });
  } catch (err) {
    console.error("getAllOrdersAdmin error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/admin/orders/:id/status
export const updateOrderStatusAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ message: "Status is required" });

    const order = await Order.findById(id).populate("items.productId");
    if (!order) return res.status(404).json({ message: "Order not found" });

    // 🔥 main status update
    order.status = status;

    // 🔥 timeline update
    order.timeline.push({
      status: status,
      time: new Date()
    });

    await order.save();

    return res.status(200).json({
      message: `Order marked as ${status}`,
      order
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


