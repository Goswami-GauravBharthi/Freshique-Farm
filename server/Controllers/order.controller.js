// routes/order.js or controllers/orderController.js
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";

export const placeOrder = async (req, res) => {
  try {
    const consumerId = req.user._id; // assuming authenticated
    const { shippingAddress, paymentMethod = "cod", deliveryCharge } = req.body;

    const consumer = await User.findById(consumerId);
    if (!consumer || consumer.cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Group cart items by farmer
    const farmerMap = {};

    consumer.cartItems.forEach((item) => {
      const farmerId = item.farmerId.toString();
      if (!farmerMap[farmerId]) {
        farmerMap[farmerId] = [];
      }
      farmerMap[farmerId].push(item);
    });

    const createdOrders = [];

    // Create one order per farmer
    for (const [farmerId, items] of Object.entries(farmerMap)) {
      const totalAmount = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const order = new Order({
        consumer: consumerId,
        farmer: farmerId,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          unit: i.unit,
          quantity: i.quantity,
          image: i.image,
        })),
        totalAmount,
        shippingAddress,
        paymentMethod,
      });

      await order.save();
      await order.populate("farmer", "fullName phoneNumber email");
      await order.populate("consumer", "fullName phoneNumber email");

      createdOrders.push(order);
    }

    // Clear consumer's cart after successful order
    consumer.cartItems = [];
    await consumer.save();

    res.status(201).json({
      success: true,
      message: "Orders placed successfully",
      orders: createdOrders,
      count: createdOrders.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

// GET /api/orders/my-orders (for farmer)
export const getFarmerOrders = async (req, res) => {
  try {
    const farmerId = req.user._id;

    const orders = await Order.find({ farmer: farmerId })
      .populate("consumer", "fullName phoneNumber")
      .sort({ createdAt: -1 });

    if (!orders) {
      return res.json({ success: false, message: "Not any order are comes" });
    }

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const consumerId = req.user._id; // from auth middleware (protect route)

    const orders = await Order.find({ consumer: consumerId })
      .populate("farmer", "fullName phoneNumber profilePicture") // farmer details
      .sort({ createdAt: -1 }) // latest first
      .lean(); // faster, plain JS objects

    // If you want to add total items count or any computed field
    const formattedOrders = orders.map((order) => ({
      ...order,
      totalItems: order.items.reduce((sum, item) => sum + item.quantity, 0),
      grandTotal: order.totalAmount + order.deliveryCharge,
    }));

    res.status(200).json({
      success: true,
      count: formattedOrders.length,
      orders: formattedOrders,
    });
  } catch (error) {
    console.error("Error fetching my orders:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching your orders",
    });
  }
};

// controllers/order.controller.js
export const updateOrderStatusByFarmer = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const farmerId = req.user._id;

    const updateData = { status };

    if (status === "delivered") {
      updateData.paymentStatus = "paid";
    }
    // Otherwise: leave paymentStatus unchanged

    const order = await Order.findOneAndUpdate(
      { orderId, farmer: farmerId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const getTopFarmers = async (req, res) => {
  try {
    const topFarmers = await Order.aggregate([
    
      { $match: { status: "delivered", paymentStatus: "paid" } },

      // Group by farmer and calculate total sales
      {
        $group: {
          _id: "$farmer",
          totalSales: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
        },
      },

      // Sort by total sales descending
      { $sort: { totalSales: -1 } },

      // Limit to top 5
      { $limit: 5 },

      // Lookup farmer details
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "farmer",
        },
      },
      { $unwind: "$farmer" },

      // Project only needed fields
      {
        $project: {
          _id: 0,
          farmerId: "$farmer._id",
          fullName: "$farmer.fullName",
          profilePicture: "$farmer.profilePicture",
          location: "$farmer.location",
          totalSales: 1,
          orderCount: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: topFarmers,
    });
  } catch (error) {
    console.error("Error fetching top farmers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch top farmers",
    });
  }
};
