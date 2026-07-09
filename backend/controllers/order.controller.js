import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Products.js";

/* ================================
        USER CHECKOUT
================================ */
export const checkoutFromCart = async (req, res) => {
  try {
    const { paymentStatus = "PENDING" } = req.body;

    // Get user's cart with product details
    const cart = await Cart.findOne({
      userId: req.user.id,
    }).populate("items.productId");

    // Check if cart is empty
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    let totalAmount = 0;

    // Create order items
    const orderItems = cart.items.map((item) => {
      const price = item.productId.price;

      totalAmount += price * item.quantity;

      return {
        productId: item.productId._id,
        quantity: item.quantity,
        price,
      };
    });

    // ================================
    // CREATE NEW ORDER
    // ================================
    const order = await Order.create({
      userId: req.user.id,
      items: orderItems,
      totalAmount,
      paymentStatus,
      status: "PENDING",
    });

    // ================================
    // 🔔 SEND REAL-TIME NOTIFICATION
    // TO ADMIN DASHBOARD
    // ================================
    const io = req.app.get("io");

    if (io) {
      io.to("admin-room").emit("new-order", {
        orderId: order._id,
        message: "New order received!",
        totalAmount: order.totalAmount,
        paymentStatus: order.paymentStatus,
        status: order.status,
        createdAt: order.createdAt,
      });

      console.log(`🔔 New order notification sent to admin: ${order._id}`);
    } else {
      console.log("⚠️ Socket.IO instance not found");
    }

    // ================================
    // CLEAR USER CART
    // ================================
    await Cart.deleteOne({
      _id: cart._id,
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    console.error("checkoutFromCart error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

/* ================================
        USER ORDER LIST
================================ */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user.id,
    })
      .sort({
        createdAt: -1,
      })
      .populate("items.productId");

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    console.error("getMyOrders error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

/* ================================
      USER → VIEW SINGLE ORDER
================================ */
export const getOrderByIdUser = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).populate("items.productId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    console.error("getOrderByIdUser error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

/* ================================
     ADMIN → GET ALL ORDERS
================================ */
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({
        createdAt: -1,
      })
      .populate("userId", "name email")
      .populate("items.productId");

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    console.error("getAllOrdersAdmin error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

/* ================================
     ADMIN → UPDATE ORDER STATUS
================================ */
export const updateOrderStatusAdmin = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = req.body.status;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Status updated",
      order,
    });
  } catch (err) {
    console.error("updateOrderStatusAdmin error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

/* ================================
     ADMIN → ASSIGN DELIVERY BOY
================================ */
export const assignDeliveryBoyAdmin = async (req, res) => {
  try {
    const { deliveryBoyId } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.deliveryBoyId = deliveryBoyId;
    order.status = "ASSIGNED";

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Assigned",
      order,
    });
  } catch (err) {
    console.error("assignDeliveryBoyAdmin error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

/* ================================
 DELIVERY BOY → HIS ORDERS
================================ */
export const getDeliveryBoyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryBoyId: req.user.id,
    })
      .populate("items.productId")
      .populate("userId");

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    console.error("getDeliveryBoyOrders error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};