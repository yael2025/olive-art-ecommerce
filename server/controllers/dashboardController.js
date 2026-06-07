const Order = require("../models/orderModel")
const User = require("../models/userModel")

const getDashboardStats = async (req, res) => {
    try {
        const orders = await Order.find({}).populate("orderItems.product", "category");

        // console.log(
        //     JSON.stringify(orders[0].orderItems[0], null, 2)
        // );
        const registeredUsers = await User.countDocuments()

        const totalOrders = orders.length

        const totalRevenue = orders.reduce((sum, order) => {
            return order.isPaid ? sum + order.totalPrice : sum
        }, 0)

        const averageOrderValue  = 
        totalOrders >0 ? Math.round(totalRevenue /totalOrders) : 0;

        const paidOrders = orders.filter((order) => order.isPaid).length;
        const notPaidOrders = orders.filter((order) => !order.isPaid).length;
        const deliveredOrders = orders.filter((order) => order.isDelivered).length;
        const pendingDeliveryOrders = orders.filter(
            (order) => !order.isDelivered
        ).length

        const topSellingMap = {}
        const categorySalesMap = {}

        orders.forEach((order) => {
            order.orderItems.forEach((item) => {
                if (!topSellingMap[item.name]) {
                    topSellingMap[item.name] = 0;
                }

                topSellingMap[item.name] += item.qty;
            });
        });

        orders.forEach((order) => {
            order.orderItems.forEach((item) => {
                const category =
                    item.category && item.category !== "Unknown"
                        ? item.category
                        : item.product?.category || "Unknown";

                if (!categorySalesMap[category]) {
                    categorySalesMap[category] = 0
                }
                categorySalesMap[category] += item.price * item.qty
            })
        })

        const topSellingProducts = Object.entries(topSellingMap)
            .map(([name, quantity]) => ({ name, quantity }))
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);

        const salesByCategory = Object.entries(categorySalesMap)
            .map(([category, revenue]) => ({
                category,
                revenue,
            }))

        res.json({
            totalOrders,
            totalRevenue,
            averageOrderValue,
            registeredUsers,
            ordersByStatus: {
                paid: paidOrders,
                notPaid: notPaidOrders,
                delivered: deliveredOrders,
                pendingDelivery: pendingDeliveryOrders
            },
            topSellingProducts,
            salesByCategory,
            
        })
    } catch (error) {
        console.error("DASHBOARD STATS ERROR:", error);
        res.status(500).json({ message: "Server error" });
    }
}
module.exports = {
    getDashboardStats,
};