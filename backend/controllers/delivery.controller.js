import Order from "../models/Order.js";
import DeliveryBoy from "../models/DeliveryBoy.js";

// GET /api/delivery/orders
export const getAssignedOrders = async (req, res) => {
  try {
    // req.user.id is User id with role DELIVERY
    const delivery = await DeliveryBoy.findOne({ userId: req.user.id });
    if (!delivery)
      return res.status(404).json({ message: "Delivery profile not found" });

    const orders = await Order.find({ deliveryBoyId: delivery._id })
      .sort({ createdAt: -1 })
      .populate("userId", "name phone")
      .populate("items.productId");

    return res.status(200).json({ orders });
  } catch (err) {
    console.error("getAssignedOrders error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/delivery/orders/:id/status
export const updateOrderStatusByDelivery = async (req, res) => {
  try {
    const { status } = req.body;

    const delivery = await DeliveryBoy.findOne({ userId: req.user.id });
    if (!delivery)
      return res.status(404).json({ message: "Delivery profile not found" });

    const order = await Order.findOne({
      _id: req.params.id,
      deliveryBoyId: delivery._id,
    });

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    order.status = status;
    order.timeline.push({ status, time: new Date() });

    await order.save();

    // (Optional) socket.io emit here for live update

    return res
      .status(200)
      .json({ message: "Status updated", order });
  } catch (err) {
    console.error("updateOrderStatusByDelivery error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/delivery/location
export const updateDeliveryLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    const delivery = await DeliveryBoy.findOne({ userId: req.user.id });
    if (!delivery)
      return res.status(404).json({ message: "Delivery profile not found" });

    delivery.lastKnownLocation = {
      type: "Point",
      coordinates: [lng, lat],
    };

    await delivery.save();

    // TODO: socket.io broadcast to user about live location

    return res.status(200).json({ message: "Location updated" });
  } catch (err) {
    console.error("updateDeliveryLocation error", err);
    return res.status(500).json({ message: "Server error" });
  }
};
