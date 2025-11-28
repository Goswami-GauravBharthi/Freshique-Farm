import {Order} from "../models/order.model.js";
import mongoose from "mongoose";




export const getFarmerAnalytics = async (req, res) => {
  try {
    const farmerId = req.user._id;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const startOfLast3Months = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const last30DaysStart = new Date(today);
    last30DaysStart.setDate(today.getDate() - 29);

    const farmerObjectId = new mongoose.Types.ObjectId(farmerId);

    const matchDelivered = { status: "delivered", farmer: farmerObjectId };

    const [
      coreStats,
      topProducts,
      dailySales,
      monthlyTrend,
      paymentStats,
      orderStatusBreakdown,
    ] = await Promise.all([
      // 1. Core Stats – SAFE even if no orders
      Order.aggregate([
        { $match: matchDelivered },
        {
          $facet: {
            today: [{ $match: { createdAt: { $gte: today } } }, { $group: { _id: null, revenue: { $sum: "$totalAmount" }, orders: { $sum: 1 }, aov: { $avg: "$totalAmount" } } }],
            thisMonth: [{ $match: { createdAt: { $gte: startOfMonth } } }, { $group: { _id: null, revenue: { $sum: "$totalAmount" }, orders: { $sum: 1 }, aov: { $avg: "$totalAmount" } } }],
            lastMonth: [{ $match: { createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } } }, { $group: { _id: null, revenue: { $sum: "$totalAmount" }, orders: { $sum: 1 } } }],
            last90Days: [{ $match: { createdAt: { $gte: startOfLast3Months } } }, { $group: { _id: null, revenue: { $sum: "$totalAmount" } } }],
            allTime: [
              {
                $group: {
                  _id: null,
                  totalRevenue: { $sum: "$totalAmount" },
                  totalOrders: { $sum: 1 },
                  customers: { $addToSet: "$consumer" },
                },
              },
            ],
          },
        },
        {
          $project: {
            // Always return these fields – even if null → prevents empty $project
            todayRevenue: { $ifNull: [{ $arrayElemAt: ["$today.revenue", 0] }, 0] },
            todayOrders: { $ifNull: [{ $arrayElemAt: ["$today.orders", 0] }, 0] },
            todayAOV: { $ifNull: [{ $arrayElemAt: ["$today.aov", 0] }, 0] },

            monthlyRevenue: { $ifNull: [{ $arrayElemAt: ["$thisMonth.revenue", 0] }, 0] },
            monthlyOrders: { $ifNull: [{ $arrayElemAt: ["$thisMonth.orders", 0] }, 0] },
            monthlyAOV: { $ifNull: [{ $arrayElemAt: ["$thisMonth.aov", 0] }, 0] },

            lastMonthRevenue: { $ifNull: [{ $arrayElemAt: ["$lastMonth.revenue", 0] }, 0] },
            last90DaysRevenue: { $ifNull: [{ $arrayElemAt: ["$last90Days.revenue", 0] }, 0] },

            totalRevenue: { $ifNull: [{ $arrayElemAt: ["$allTime.totalRevenue", 0] }, 0] },
            totalOrders: { $ifNull: [{ $arrayElemAt: ["$allTime.totalOrders", 0] }, 0] },
            uniqueCustomers: {
              $size: { $ifNull: [{ $arrayElemAt: ["$allTime.customers", 0] }, []] },
            },

            // Always include this dummy field to prevent empty projection
            _placeholder: 1,
          },
        },
        { $unset: "_placeholder" }, // Remove dummy field
      ]),

      // 2. Top Products
      Order.aggregate([
        { $match: { ...matchDelivered, createdAt: { $gte: startOfLast3Months } } },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.productId",
            name: { $first: "$items.name" },
            image: { $first: "$items.image" },
            unit: { $first: "$items.unit" },
            totalQty: { $sum: "$items.quantity" },
            totalSales: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
          },
        },
        { $sort: { totalQty: -1 } },
        { $limit: 10 },
        {
          $project: {
            productId: "$_id",
            name: 1,
            image: 1,
            unit: 1,
            totalQty: 1,
            totalSales: 1,
            _id: 0,
          },
        },
      ]).allowDiskUse(true),

      // 3. Daily Sales
      Order.aggregate([
        { $match: { ...matchDelivered, createdAt: { $gte: last30DaysStart } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: "$totalAmount" },
            orders: { $sum: 1 },
            avgOrderValue: { $avg: "$totalAmount" },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            date: "$_id",
            revenue: 1,
            orders: 1,
            avgOrderValue: { $round: ["$avgOrderValue", 2] },
            _id: 0,
          },
        },
      ]),

      // 4. Monthly Trend
      Order.aggregate([
        { $match: matchDelivered },
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            revenue: { $sum: "$totalAmount" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $limit: 6 },
        {
          $project: {
            month: { $dateToString: { format: "%b %Y", date: { $dateFromParts: { year: "$_id.year", month: "$_id.month", day: 1 } } } },
            revenue: 1,
            orders: 1,
            _id: 0,
          },
        },
      ]),

      // 5. Payment Breakdown
      Order.aggregate([
        { $match: matchDelivered },
        {
          $group: {
            _id: "$paymentMethod",
            count: { $sum: 1 },
            revenue: { $sum: "$totalAmount" },
          },
        },
        {
          $project: {
            method: { $ifNull: ["$_id", "unknown"] },
            count: 1,
            revenue: 1,
            _id: 0,
          },
        },
      ]),

      // 6. Active Orders (Not Delivered)
      Order.aggregate([
        { $match: { farmer: farmerObjectId, status: { $ne: "delivered" } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $project: { status: "$_id", count: 1, _id: 0 } },
      ]),
    ]);

    const stats = coreStats[0] || {};

    const response = {
      summary: {
        todayRevenue: Number(stats.todayRevenue || 0),
        todayOrders: Number(stats.todayOrders || 0),
        todayAOV: Number((stats.todayAOV || 0).toFixed(2)),

        monthlyRevenue: Number(stats.monthlyRevenue || 0),
        monthlyOrders: Number(stats.monthlyOrders || 0),
        monthlyAOV: Number((stats.monthlyAOV || 0).toFixed(2)),

        lastMonthRevenue: Number(stats.lastMonthRevenue || 0),
        monthlyGrowth: stats.lastMonthRevenue
          ? Number((((stats.monthlyRevenue || 0) - stats.lastMonthRevenue) / stats.lastMonthRevenue) * 100).toFixed(1)
          : 0,

        last90DaysRevenue: Number(stats.last90DaysRevenue || 0),
        totalRevenue: Number(stats.totalRevenue || 0),
        totalOrders: Number(stats.totalOrders || 0),
        uniqueCustomers: Number(stats.uniqueCustomers || 0),
      },

      charts: {
        dailySales30Days: dailySales,
        monthlyRevenueTrend: monthlyTrend,
      },

      topProducts: topProducts || [],
      paymentBreakdown: (paymentStats || []).map(p => ({
        method: p.method === "cod" ? "Cash on Delivery" : "Online Payment",
        count: p.count || 0,
        revenue: p.revenue || 0,
        percentage: paymentStats.length > 0
          ? Number(((p.count / paymentStats.reduce((a, b) => a + b.count, 0)) * 100).toFixed(1))
          : 0,
      })),

      activeOrderStatus: (orderStatusBreakdown || []).reduce((acc, curr) => {
        acc[curr.status] = curr.count;
        return acc;
      }, {}),

      generatedAt: new Date().toISOString(),
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Farmer Analytics Error:", error);
    return res.status(500).json({
      message: "Failed to load your analytics",
      error: error.message,
    });
  }
};