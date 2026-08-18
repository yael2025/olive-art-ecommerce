const request = require("supertest");
const app = require("../app");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const bcrypt = require("bcryptjs");

describe("Dashboard Analytics", () => {

    // Test #20 - Return correct dashboard statistics
    test("should return correct dashboard statistics", async () => {
        await User.create({
            username: "Admin",
            email: "admin@test.com",
            password: await bcrypt.hash("123456", 10),
            role: "admin",
            isAdmin: true,
        });

        const customer = await User.create({
            username: "Customer",
            email: "customer@test.com",
            password: await bcrypt.hash("123456", 10),
            role: "customer",
            isAdmin: false,
        });

        const product = await Product.create({
            name: "Olive Wood Mezuzah",
            price: 120,
            countInStock: 10,
            category: "Mezuzah",
        });

        await Order.create({
            user: customer._id,
            orderItems: [
                {
                    name: product.name,
                    qty: 2,
                    price: 120,
                    category: "Mezuzah",
                    product: product._id,
                },
            ],
            shippingDetails: {
                fullName: "Customer Test",
                phone: "0500000000",
                city: "Test City",
                address: "Test Address 1",
                shippingMethod: "Home Delivery",
            },
            totalPrice: 240,
            isPaid: true,
            paidAt: new Date(),
            isDelivered: false,
        });

        const loginResponse = await request(app)
            .post("/api/users/login")
            .send({
                email: "admin@test.com",
                password: "123456",
            });

        const token = loginResponse.body.token;

        const response = await request(app)
            .get("/api/dashboard/stats")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.totalOrders).toBe(1);
        expect(response.body.totalRevenue).toBe(240);
        expect(response.body.averageOrderValue).toBe(240);
        expect(response.body.registeredUsers).toBe(2);

        expect(response.body.ordersByStatus.paid).toBe(1);
        expect(response.body.ordersByStatus.notPaid).toBe(0);
        expect(response.body.ordersByStatus.delivered).toBe(0);
        expect(response.body.ordersByStatus.pendingDelivery).toBe(1);

        expect(response.body.topSellingProducts[0].name)
            .toBe("Olive Wood Mezuzah");

        expect(response.body.topSellingProducts[0].quantity)
            .toBe(2);

        expect(response.body.salesByCategory[0].category)
            .toBe("Mezuzah");

        expect(response.body.salesByCategory[0].revenue)
            .toBe(240);
    });
});