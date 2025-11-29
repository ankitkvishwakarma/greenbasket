// =================== DELIVERY CONTROLLER ===================
import Order from "../models/Order.js";
import DeliveryBoy from "../models/DeliveryBoy.js";


// 📌 1. Delivery Boy → Assigned Orders Fetch
export const getAssignedOrders = async (req, res) => {
  try {
    const delivery = await DeliveryBoy.findOne({ userId:req.user.id });
    if (!delivery) return res.status(404).json({ message:"Delivery profile not found" });

    const orders = await Order.find({ deliveryBoyId:delivery._id })
      .sort({ createdAt:-1 })
      .populate("userId","name phone")
      .populate("items.productId");

    res.status(200).json({ orders });

  } catch(err){
    console.log("getAssignedOrders error:",err);
    res.status(500).json({ message:"Server error" });
  }
};



// 📌 2. Delivery Boy → Update order status
export const updateOrderStatusByDelivery = async (req,res)=>{
  try{
    const { status } = req.body;

    const delivery = await DeliveryBoy.findOne({ userId:req.user.id });
    if (!delivery) return res.status(404).json({ message:"Delivery profile not found" });

    const order = await Order.findOne({_id:req.params.id,deliveryBoyId:delivery._id});
    if (!order) return res.status(404).json({ message:"Order not found" });

    order.status = status;
    order.timeline.push({ status, time:new Date() });
    await order.save();

    req.io?.emit("order-status-update",{orderId:order._id,status,time:new Date()});

    res.status(200).json({ message:"Status updated", order });

  } catch(err){
    console.error(err);
    res.status(500).json({ message:"Server error" });
  }
};

export const assignDeliveryBoy = async (req,res)=>{
  try{
    const {orderId, deliveryBoyId} = req.body;

    const delivery = await DeliveryBoy.findById(deliveryBoyId);
    if(!delivery) return res.status(404).json({message:"Delivery boy not found"});

    const order = await Order.findById(orderId);
    if(!order) return res.status(404).json({message:"Order not found"});

    order.deliveryBoyId = delivery._id;
    order.status = "OUT_FOR_DELIVERY";
    order.timeline.push({status:"OUT_FOR_DELIVERY",time:new Date()});
    await order.save();

    return res.status(200).json({message:"Order assigned to delivery boy",order});
  
  }catch(err){
    console.log(err);
    return res.status(500).json({message:"Server Error"});
  }
};




// 📌 3. Delivery Boy → Live Location Update
export const updateDeliveryLocation = async (req,res)=>{
  try{
    const {lat,lng} = req.body;

    const delivery = await DeliveryBoy.findOne({userId:req.user.id});
    if (!delivery) return res.status(404).json({ message:"Delivery profile not found" });

    delivery.lastKnownLocation = { type:"Point", coordinates:[lng,lat] };
    await delivery.save();

    req.io?.emit("delivery-location-update",{deliveryBoyId:delivery._id,lat,lng,time:new Date()});

    res.status(200).json({ message:"Location updated" });

  } catch(err){
    console.error(err);
    res.status(500).json({ message:"Server error" });
  }
};
